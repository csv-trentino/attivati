package accounts

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/app/events"
	"github.com/wevolunteer/wevolunteer/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type RequestCodeReason string

const (
	accessTokenExpiry                    = time.Minute * 15
	refreshTokenExpiry                   = time.Hour * 24 * 7
	OTPCodeLength                        = 5
	OTPCodeTTL                           = 30
	RequestCodeAuth    RequestCodeReason = "verify"
	RequestCodeDelete  RequestCodeReason = "delete"
)

type LoginData struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignupData struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type RefreshTokenData struct {
	RefreshToken string `json:"refresh_token"`
}

type TokenData struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type RequestCodeData struct {
	Email  string             `json:"email"`
	Reason *RequestCodeReason `json:"reason,omitempty"`
}

type VerifyCodeData struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type OTP struct {
	OTPCode         string    `json:"otp_code"`
	OTPCodeExpireAt time.Time `json:"otp_code_expire_at"`
}

func requestCode(data RequestCodeData) error {
	var user *models.User

	if err := UserQuery().Where("email = ?", data.Email).First(&user).Error; err != nil {
		user, err = UserCreate(&UserCreateData{
			Email: data.Email,
		})

		if err != nil {
			return err
		}
	}

	otp := generateOTP()

	if data.Email == app.Config.STORE_SERVICE_ACCOUNT {
		otp = &OTP{
			OTPCode:         app.Config.STORE_SERVICE_OTP,
			OTPCodeExpireAt: time.Now().Add(time.Minute * time.Duration(OTPCodeTTL)),
		}
	}

	user.OTPCode = otp.OTPCode
	user.OTPCodeExpireAt = otp.OTPCodeExpireAt

	if err := app.DB.Save(user).Error; err != nil {
		return err
	}

	if data.Reason == nil || *data.Reason == RequestCodeAuth {
		events.Publish(events.Event{
			Type: events.UserCodeRequestedAuth,
			Payload: events.EventPayload{
				Data: user,
			},
		})
	}

	if data.Reason != nil && *data.Reason == RequestCodeDelete {
		events.Publish(events.Event{
			Type: events.UserCodeRequestedDelete,
			Payload: events.EventPayload{
				Data: user,
			},
		})
	}

	return nil
}

func verifyCode(data VerifyCodeData) (*TokenData, error) {
	var user models.User
	if err := app.DB.Where("email = ?", data.Email).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}

	if user.OTPCode != data.Code || user.OTPCode == "" {
		return nil, errors.New("invalid code")
	}

	if user.OTPCodeExpireAt.Before(time.Now()) {
		return nil, errors.New("code expired")
	}

	user.IsEmailVerified = true
	user.OTPCode = ""
	user.OTPCodeExpireAt = time.Time{}

	if err := app.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	token, err := generateToken(&user, app.RoleVolunteer)

	if err != nil {
		return nil, err
	}

	events.Publish(events.Event{
		Type: events.UserCodeVerified,
		Payload: events.EventPayload{
			Data: user,
		},
	})

	return token, nil
}

func superUserLogin(data LoginData) (*TokenData, error) {
	// TODO: auth user only if admin
	var user models.User
	if err := app.DB.Where("email = ?", data.Email).First(&user).Error; err != nil {
		return nil, &app.ErrBadInput{Message: "user not found"}
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password)); err != nil {
		return nil, &app.ErrBadInput{Message: "invalid email or password"}
	}

	return generateToken(&user, app.RoleSuperUser)
}

func refreshToken(data RefreshTokenData) (*TokenData, error) {
	var user models.User

	claims := &app.JWTClaims{}
	token, err := jwt.ParseWithClaims(data.RefreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(app.Config.JWT_SECRET), nil
	})

	if err != nil || !token.Valid {
		return nil, errors.New("invalid refresh token")
	}

	if err := app.DB.Where("email = ?", claims.Subject).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}

	return generateToken(&user, app.RoleVolunteer)
}

func generateToken(user *models.User, role app.Role) (*TokenData, error) {
	claims := &app.JWTClaims{
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessTokenExpiry)),
			Subject:   user.Email,
		},
	}

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	access_token, err := at.SignedString([]byte(app.Config.JWT_SECRET))

	if err != nil {
		return nil, err
	}

	claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(refreshTokenExpiry))
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	refresh_token, err := rt.SignedString([]byte(app.Config.JWT_SECRET))

	if err != nil {
		return nil, err
	}

	return &TokenData{
		AccessToken:  access_token,
		RefreshToken: refresh_token,
	}, nil
}

func generateOTP() *OTP {
	otp := ""
	for i := 0; i < OTPCodeLength; i++ {
		otp += fmt.Sprintf("%d", rand.Intn(10))
	}

	return &OTP{
		OTPCode:         otp,
		OTPCodeExpireAt: time.Now().Add(time.Minute * time.Duration(OTPCodeTTL)),
	}
}
