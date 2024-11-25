package accounts

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

// type RequestCodeInput struct {
// }

// func RequestCodeController(c context.Context, input *struct{}) (*AuhenticationResponse, error) {
// 	token, err := requestCode()

// 	if err != nil {
// 		return nil, huma.Error400BadRequest(err.Error())
// 	}

// 	resp := &AuhenticationResponse{}
// 	resp.Body = *token
// 	return resp, nil
// }

type LoginInput struct {
	Body LoginData
}

type AuhenticationResponse struct {
	Body TokenData
}

func AdminLoginController(c context.Context, input *LoginInput) (*AuhenticationResponse, error) {
	token, err := superUserLogin(input.Body)

	if err != nil {
		return nil, huma.Error401Unauthorized("invalid email or password")
	}

	resp := &AuhenticationResponse{
		Body: *token,
	}

	return resp, nil
}

type RefreshTokenInput struct {
	Body RefreshTokenData
}

func RefreshTokenController(c context.Context, input *RefreshTokenInput) (*AuhenticationResponse, error) {
	token, err := refreshToken(input.Body)

	if err != nil {
		return nil, huma.Error401Unauthorized("invalid refresh token")
	}

	resp := &AuhenticationResponse{}
	resp.Body = *token
	return resp, nil
}

type UserInfoResponse struct {
	Body models.User
}

func UserProfileGetController(c context.Context, input *struct{}) (*UserInfoResponse, error) {
	user, ok := c.Value("user").(*models.User)

	if !ok {
		return nil, huma.Error401Unauthorized("user not found")
	}

	data, err := UserProfileGet(user)

	if err != nil {
		return nil, err
	}

	return &UserInfoResponse{
		Body: *data,
	}, nil
}

type UserProfileUpdateRequest struct {
	Body UserProfileUpdateData
}

func UserProfileUpdateController(c context.Context, input *UserProfileUpdateRequest) (*UserInfoResponse, error) {
	user, ok := c.Value("user").(*models.User)

	if !ok {
		return nil, huma.Error401Unauthorized("user not found")
	}

	err := UserProfileUpdate(user, input.Body)

	if err != nil {
		return nil, err
	}

	return &UserInfoResponse{
		Body: *user,
	}, nil

}

type UserProfileDeleteRequest struct {
	Body UserProfileDeleteData
}

func UserProfileDeleteController(c context.Context, input *UserProfileDeleteRequest) (*struct{}, error) {
	user, ok := c.Value("user").(*models.User)

	if !ok {
		return nil, huma.Error401Unauthorized("user not found")
	}

	err := UserProfileDelete(user, input.Body)

	if err != nil {
		return nil, err
	}

	return nil, nil

}

type UserListResponse struct {
	Body *UserListData
}

func UserListController(c context.Context, input *UserFilters) (*UserListResponse, error) {
	ctx := app.FromHTTPContext(c)
	users, err := UsersList(ctx, input)

	if err != nil {
		return nil, err
	}

	return &UserListResponse{
		Body: users,
	}, nil
}

type UserGetRequest struct {
	ID uint `path:"id"`
}

type UserGetResponse struct {
	Body models.User
}

func UserGetController(c context.Context, input *UserGetRequest) (*UserGetResponse, error) {
	user, err := UserGet(input.ID)

	if err != nil {
		return nil, err
	}

	return &UserGetResponse{
		Body: *user,
	}, nil
}

type UserCreateRequest struct {
	Body UserCreateData
}

type UserCreateResponse struct {
	Body models.User
}

func UserCreateController(c context.Context, input *UserCreateRequest) (*UserCreateResponse, error) {
	user, err := UserCreate(&input.Body)

	if err != nil {
		return nil, err
	}

	return &UserCreateResponse{
		Body: *user,
	}, nil
}

type UserUpdateRequest struct {
	ID   uint `path:"id"`
	Body UserUpdateData
}

type UserUpdateResponse struct {
	Body models.User
}

func UserUpdateController(c context.Context, input *UserUpdateRequest) (*UserUpdateResponse, error) {
	user, err := UserUpdate(input.ID, &input.Body)

	if err != nil {
		return nil, err
	}

	return &UserUpdateResponse{
		Body: *user,
	}, nil
}

type UserDeleteRequest struct {
	ID uint `path:"id"`
}

type UserDeleteResponse struct{}

func UserDeleteController(c context.Context, input *UserDeleteRequest) (*UserDeleteResponse, error) {

	err := UserDelete(input.ID)

	if err != nil {
		return nil, err
	}

	return &UserDeleteResponse{}, nil
}

type UserRequestCodeRequest struct {
	Body RequestCodeData
}

func UserRequestCodeController(c context.Context, input *UserRequestCodeRequest) (*struct{}, error) {
	err := requestCode(input.Body)

	if err != nil {
		return nil, huma.Error400BadRequest(err.Error())
	}

	return nil, nil
}

type UserVerifyCodeRequest struct {
	Body VerifyCodeData
}

func UserVerifyCodeController(c context.Context, input *UserVerifyCodeRequest) (*AuhenticationResponse, error) {
	token, err := verifyCode(input.Body)

	if err != nil {
		return nil, huma.Error400BadRequest(err.Error())
	}

	return &AuhenticationResponse{
		Body: *token,
	}, nil
}

// User Devices

type UserDeviceListResponse struct {
	Body UserDeviceListData
}

func UserDeviceListController(c context.Context, input *UserDeviceFilters) (*UserDeviceListResponse, error) {
	ctx := app.FromHTTPContext(c)
	data, err := UserDeviceList(ctx, input)

	if err != nil {
		return nil, err
	}

	return &UserDeviceListResponse{
		Body: *data,
	}, nil
}

type UserDeviceCreateRequest struct {
	Body UserDeviceCreateData
}

type UserDeviceCreateResponse struct {
	Body models.UserDevice
}

func UserDeviceCreateController(c context.Context, input *UserDeviceCreateRequest) (*UserDeviceCreateResponse, error) {
	ctx := app.FromHTTPContext(c)

	device, err := UserDeviceCreate(ctx, &input.Body)

	if err != nil {
		return nil, err
	}

	return &UserDeviceCreateResponse{
		Body: *device,
	}, nil
}

func UserExportController(c context.Context, input *struct{}) (*huma.StreamResponse, error) {

	res := UserExportStream()

	return res, nil
}
