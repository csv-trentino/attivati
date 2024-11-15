package accounts

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/wevolunteer/wevolunteer/internal/app"
)

var (
	RouteTagsAuth     []string = []string{"Authentication"}
	RouteTagsAccounts []string = []string{"Accounts"}
	RouteTagsUsers    []string = []string{"Users"}
)

func RegisterRoutes(api huma.API) {
	huma.Register(
		api,
		huma.Operation{
			OperationID: "request-code",
			Method:      http.MethodPost,
			Summary:     "Request code",
			Path:        "/auth/request-code",
			Tags:        RouteTagsAuth,
		},
		UserRequestCodeController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "verify-code",
			Method:      http.MethodPost,
			Summary:     "Verify code",
			Path:        "/auth/verify-code",
			Tags:        RouteTagsAuth,
		},
		UserVerifyCodeController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "refresh-token",
			Method:      http.MethodPost,
			Summary:     "Refresh token",
			Path:        "/auth/refresh",
			Tags:        RouteTagsAuth,
		},
		RefreshTokenController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-info",
			Method:      http.MethodGet,
			Summary:     "Get user info",
			Path:        "/auth/user",
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
			},
			Tags: RouteTagsAccounts,
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserProfileGetController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "login",
			Method:      http.MethodPost,
			Summary:     "Admin Login",
			Path:        "/admin/login",
			Tags:        RouteTagsAccounts,
			Hidden:      true,
		},
		AdminLoginController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "users-profile-update",
			Method:      http.MethodPatch,
			Summary:     "Update user profile",
			Path:        "/auth/user",
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
			},
			Tags: RouteTagsAccounts,
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserProfileUpdateController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "users-profile-delete",
			Method:      http.MethodDelete,
			Summary:     "Delete user profile",
			Path:        "/auth/user",
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
			},
			Tags: RouteTagsAccounts,
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserProfileDeleteController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "users-list",
			Method:      http.MethodGet,
			Summary:     "List users",
			Path:        "/users",
			Tags:        RouteTagsUsers,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
				app.RoleMiddleware(api, app.UserRead),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserListController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-create",
			Method:      http.MethodPost,
			Summary:     "Create user",
			Path:        "/users",
			Tags:        RouteTagsUsers,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
				app.RoleMiddleware(api, app.UserWrite),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserCreateController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-update",
			Method:      http.MethodPut,
			Summary:     "Update user",
			Path:        "/users/:id",
			Tags:        RouteTagsUsers,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
				app.RoleMiddleware(api, app.UserWrite),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserUpdateController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-delete",
			Method:      http.MethodDelete,
			Summary:     "Delete user",
			Path:        "/users/:id",
			Tags:        RouteTagsUsers,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
				app.RoleMiddleware(api, app.UserWrite),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserDeleteController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-get",
			Method:      http.MethodGet,
			Summary:     "Get user",
			Path:        "/users/{id}",
			Tags:        RouteTagsUsers,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
				app.RoleMiddleware(api, app.UserRead),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserGetController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-devices-list",
			Method:      http.MethodGet,
			Summary:     "List users devices",
			Path:        "/user-devices",
			Tags:        RouteTagsUsers,
			Hidden:      true,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserDeviceListController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-device-create",
			Method:      http.MethodPost,
			Summary:     "Register user devices",
			Path:        "/user-devices",
			Tags:        RouteTagsAccounts,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserDeviceCreateController,
	)

	huma.Register(
		api,
		huma.Operation{
			OperationID: "user-export",
			Method:      http.MethodGet,
			Summary:     "Export users in a CSV file",
			Path:        "/user-export",
			Tags:        RouteTagsUsers,
			Middlewares: huma.Middlewares{
				app.AuthMiddleware(api),
				app.RoleMiddleware(api, app.UserRead),
			},
			Security: []map[string][]string{
				{"bearer": {}},
			},
		},
		UserExportController,
	)
}
