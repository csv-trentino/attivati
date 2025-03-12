package experiences

import (
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/wevolunteer/wevolunteer/internal/app"
)

func RegisterRoutes(api huma.API) {
	huma.Register(api, huma.Operation{
		OperationID: "experiences-list",
		Summary:     "List experiences",
		Method:      http.MethodGet,
		Path:        "/experiences",
		Tags:        []string{"Experiences"},
		Middlewares: huma.Middlewares{
			app.AuthMiddleware(api),
			app.RoleMiddleware(api, app.ExperienceRead),
		},
	}, ExperienceListController)

	huma.Register(api, huma.Operation{
		OperationID: "experiences-get",
		Summary:     "Get experience",
		Method:      http.MethodGet,
		Path:        "/experiences/{id}",
		Tags:        []string{"Experiences"},
		Middlewares: huma.Middlewares{
			app.AuthMiddleware(api),
			app.RoleMiddleware(api, app.ExperienceRead),
		},
	}, ExperienceGetController)

	huma.Register(api, huma.Operation{
		OperationID: "experiences-create",
		Summary:     "Create experience",
		Method:      http.MethodPost,
		Path:        "/experiences",
		Tags:        []string{"Experiences"},
		Middlewares: huma.Middlewares{
			app.AuthMiddleware(api),
			app.RoleMiddleware(api, app.ExperienceWrite),
		},
		Security: []map[string][]string{
			{"bearer": {}},
		},
	}, ExperienceCreateController)

	huma.Register(api, huma.Operation{
		OperationID: "experiences-update",
		Summary:     "Update experience",
		Method:      http.MethodPut,
		Path:        "/experiences/{id}",
		Tags:        []string{"Experiences"},
		Middlewares: huma.Middlewares{
			app.AuthMiddleware(api),
			app.RoleMiddleware(api, app.ExperienceWrite),
		},
		Security: []map[string][]string{
			{"bearer": {}},
		},
	}, ExperienceUpdateController)

	huma.Register(api, huma.Operation{
		OperationID: "experiences-delete",
		Summary:     "Delete experience",
		Method:      http.MethodDelete,
		Path:        "/experiences/{id}",
		Tags:        []string{"Experiences"},
		Middlewares: huma.Middlewares{
			app.AuthMiddleware(api),
			app.RoleMiddleware(api, app.ExperienceWrite),
		},
		Security: []map[string][]string{
			{"bearer": {}},
		},
	}, ExperienceDeleteController)

}
