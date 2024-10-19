package accounts

import (
	"errors"
	"time"

	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/app/events"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

type UserProfileUpdateData struct {
	Avatar                             *string  `json:"avatar,omitempty"`
	FistName                           *string  `json:"first_name,omitempty"`
	LastName                           *string  `json:"last_name,omitempty"`
	Phone                              *string  `json:"phone,omitempty"`
	Email                              *string  `json:"email,omitempty"`
	DateOfBirth                        *string  `json:"date_of_birth,omitempty"`
	AcceptTOS                          *bool    `json:"accepted_tos,omitempty"`
	HasAcceptedNewsletter              *bool    `json:"accepted_newsletter,omitempty"`
	TaxCode                            *string  `json:"tax_code,omitempty"`
	City                               *string  `json:"city,omitempty"`
	Languages                          *string  `json:"languages,omitempty"`
	Job                                *string  `json:"job,omitempty"`
	Bio                                *string  `json:"bio,omitempty"`
	Latitude                           *float64 `json:"latitude,omitempty"`
	Longitude                          *float64 `json:"longitude,omitempty"`
	Categories                         *[]uint  `json:"categories,omitempty"`
	NotificationsNearbyActivities      *bool    `json:"notifications_nearby_activities,omitempty" gorm:"default:true"`
	NotificationsFollowedOrganizations *bool    `json:"notifications_followed_organizations,omitempty" gorm:"default:true"`
	NotificationActivityReminders      *bool    `json:"notifications_activity_reminders,omitempty" gorm:"default:true"`
}

type UserProfileDeleteData struct {
	OTP string `json:"otp"`
}

func UserProfileGet(user *models.User) (*models.User, error) {
	if err := app.DB.Preload("FavoriteCategories").First(&user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func UserProfileUpdate(user *models.User, data UserProfileUpdateData) error {
	registration := user.FirstName == "" && user.LastName == "" && data.FistName != nil && data.LastName != nil

	if data.Avatar != nil {
		user.Avatar = *data.Avatar
	}

	if data.FistName != nil {
		user.FirstName = *data.FistName
	}

	if data.LastName != nil {
		user.LastName = *data.LastName
	}

	if data.Phone != nil {
		user.Phone = *data.Phone
	}

	if data.Email != nil {
		user.Email = *data.Email
	}

	if data.AcceptTOS != nil {
		user.HasAcceptedTOS = *data.AcceptTOS
	}

	if data.TaxCode != nil {
		user.TaxCode = *data.TaxCode
	}

	if data.Bio != nil {
		user.Bio = *data.Bio
	}

	if data.Latitude != nil {
		user.Latitude = *data.Latitude
	}

	if data.Longitude != nil {
		user.Longitude = *data.Longitude
	}

	if data.DateOfBirth != nil {
		user.DateOfBirth = *data.DateOfBirth
	}

	if data.City != nil {
		user.City = *data.City
	}

	if data.Languages != nil {
		user.Languages = *data.Languages
	}

	if data.Job != nil {
		user.Job = *data.Job
	}

	if data.Categories != nil {
		app.DB.Model(&user).Association("FavoriteCategories").Clear()

		for _, categoryID := range *data.Categories {
			var category models.Category
			if err := app.DB.Where("id = ?", categoryID).First(&category).Error; err != nil {
				return err
			}

			if err := app.DB.Model(&user).Association("FavoriteCategories").Append(&category); err != nil {
				return err
			}
		}
	}

	if data.HasAcceptedNewsletter != nil {
		user.HasAcceptedNewsletter = *data.HasAcceptedNewsletter
	}

	if data.NotificationsNearbyActivities != nil {
		user.NotificationsNearbyActivities = *data.NotificationsNearbyActivities
	}

	if data.NotificationsFollowedOrganizations != nil {
		user.NotificationsFollowedOrganizations = *data.NotificationsFollowedOrganizations
	}

	if data.NotificationActivityReminders != nil {
		user.NotificationActivityReminders = *data.NotificationActivityReminders
	}

	if err := app.DB.Save(&user).Error; err != nil {
		return err
	}

	if registration {
		events.Publish(events.Event{
			Type: events.UserSignup,
			Payload: events.EventPayload{
				Data: &events.UserEventPayload{
					User: user,
				},
			},
		})
	}

	return nil
}

func UserProfileDelete(user *models.User, data UserProfileDeleteData) error {
	if err := app.DB.Where("email = ?", user.Email).First(&user).Error; err != nil {
		return errors.New("user not found")
	}

	if user.OTPCode != data.OTP || user.OTPCode == "" {
		return errors.New("invalid code")
	}

	if user.OTPCodeExpireAt.Before(time.Now()) {
		return errors.New("code expired")
	}

	randomString, err := generateRandomString(10)

	if err != nil {
		return err
	}

	deletedUser := *user

	user.Email = "deleted_user_" + randomString
	user.OTPCode = ""
	user.FirstName = "Deleted"
	user.LastName = "User"
	user.Phone = ""
	user.TaxCode = ""
	user.IsEmailVerified = false
	user.OTPCodeExpireAt = time.Time{}
	user.City = ""
	user.Languages = ""
	user.Job = ""
	user.Bio = ""
	user.Latitude = 0
	user.Longitude = 0
	user.DateOfBirth = ""
	user.TaxCode = ""
	user.HasAcceptedTOS = false
	user.HasAcceptedNewsletter = false

	if err := app.DB.Save(&user).Error; err != nil {
		return err
	}

	events.Publish(events.Event{
		Type: events.UserDeleted,
		Payload: events.EventPayload{
			Data: &events.UserEventPayload{
				User: &deletedUser,
			},
		},
	})

	return nil
}
