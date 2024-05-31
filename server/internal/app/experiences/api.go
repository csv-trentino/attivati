package experiences

import (
	"context"
	"fmt"

	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

type ExperienceListRequest struct {
	Query string `query:"q" required:"false"`
}

type ExperienceListResponse struct {
	Body ExperienceListData
}

func ExperienceListController(
	c context.Context,
	input *ExperienceListRequest,
) (*ExperienceListResponse, error) {
	ctx := app.FromHTTPContext(c)
	data, err := ExperienceList(ctx, input.Query)

	if err != nil {
		return nil, err
	}

	fmt.Println(data)

	resp := &ExperienceListResponse{}

	resp.Body = *data

	return resp, nil
}

type ExperienceCreateRequest struct {
	Body ExperienceCreateData
}

type ExperienceCreateResponse struct {
	Body models.Experience
}

func ExperienceCreateController(
	c context.Context,
	input *ExperienceCreateRequest,
) (*ExperienceCreateResponse, error) {
	ctx := app.FromHTTPContext(c)
	data, err := ExperienceCreate(ctx, &input.Body)

	if err != nil {
		return nil, err
	}

	resp := &ExperienceCreateResponse{}

	resp.Body = *data

	return resp, nil
}

type ExperienceUpdateRequest struct {
	ID   uint `path:"id"`
	Body ExperienceUpdateData
}

type ExperienceUpdateResponse struct {
	Body models.Experience
}

func ExperienceUpdateController(
	c context.Context,
	input *ExperienceUpdateRequest,
) (*ExperienceUpdateResponse, error) {
	ctx := app.FromHTTPContext(c)
	data, err := ExperienceUpdate(ctx, input.ID, &input.Body)

	if err != nil {
		return nil, err
	}

	resp := &ExperienceUpdateResponse{}

	resp.Body = *data

	return resp, nil
}

type ExperienceDeleteRequest struct {
	ID uint `path:"id"`
}

type ExperienceDeleteResponse struct{}

func ExperienceDeleteController(
	c context.Context,
	input *ExperienceDeleteRequest,
) (*ExperienceDeleteResponse, error) {
	ctx := app.FromHTTPContext(c)
	err := ExperienceDelete(ctx, input.ID)

	if err != nil {
		return nil, err
	}

	resp := &ExperienceDeleteResponse{}

	return resp, nil
}
