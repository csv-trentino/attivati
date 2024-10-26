package events

import (
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

type EventPayload struct {
	Ctx  app.Context
	Data interface{}
}

type UserEventPayload struct {
	User *models.User
}

type UserDeviceCreatePayload struct {
	User   *models.User
	Device *models.UserDevice
}

type UserDeviceCreateEventPayload struct {
	Ctx  app.Context
	Data UserDeviceCreatePayload
}

type ExperienceCreatedPayload struct {
	Experience *models.Experience
}

type ActivityNotificationEventPayload struct {
	Activity *models.Activity `json:"activity"`
	User     *models.User     `json:"user"`
}
type UserFollowOrgPayload struct {
	User         *models.User         `json:"user"`
	Organization *models.Organization `json:"organization"`
}

type UserUnfollowOrgPayload struct {
	User         *models.User         `json:"user"`
	Organization *models.Organization `json:"organization"`
}
