package activities

import (
	"fmt"
	"time"

	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/app/accounts"
	"github.com/wevolunteer/wevolunteer/internal/app/events"
	"github.com/wevolunteer/wevolunteer/internal/app/experiences"
	"github.com/wevolunteer/wevolunteer/internal/models"
	"gorm.io/gorm"
)

func ActivityQuery(ctx *app.Context) *gorm.DB {
	q := app.DB.Model(&models.Activity{})
	q.Preload("Experience.Organization")
	q.Preload("User")

	if ctx.Role == app.RolePublic {
		q = q.Where("1 != 1")
	}

	if ctx.Role == app.RoleVolunteer {
		q = q.Where("user_id = ?", ctx.User.ID)
	}

	if ctx.Role == app.RoleOrganization {
		//  todo review this
		q = q.Joins("JOIN activities ON activities.id = enrollments.activity_id").
			Where("activities.organization_id = ?", ctx.User.ID)
	}

	return q
}

func ActivityGet(ctx *app.Context, id uint) (*models.Activity, error) {
	var activity models.Activity

	if err := ActivityQuery(ctx).Preload("Experience.Organization").Where("id = ?", id).First(&activity).Error; err != nil {
		return nil, err
	}

	return &activity, nil
}

type ActivityFilters struct {
	app.PaginationInput
	Query         string `query:"q"`
	Status        string `query:"status"`
	EndDateFrom   string `query:"end_date_from"`
	EndDateTo     string `query:"end_date_to"`
	StartDateFrom string `query:"start_date_from"`
	StartDateTo   string `query:"start_date_to"`
	LastUpdate    string `query:"last_update"`
}

type ActivityListData struct {
	Results  []models.Activity   `json:"results"`
	PageInfo *app.PaginationInfo `json:"page_info"`
}

func ActivityList(ctx *app.Context, filters *ActivityFilters) (*ActivityListData, error) {
	data := &ActivityListData{}

	q := ActivityQuery(ctx)
	q.Preload("Experience.Organization")
	q.Preload("User")

	if filters != nil {
		if filters.Query != "" {
			q = q.Where("name LIKE ?", "%"+filters.Query+"%")
		}

		if filters.Status != "" {
			q = q.Where("status = ?", filters.Status)
		}

		if filters.EndDateFrom != "" {
			endDate, err := time.Parse("2006-01-02", filters.EndDateFrom)
			if err != nil {
				return nil, fmt.Errorf("invalid end date from")
			}
			q = q.Where("end_date >= ?", endDate)
		}

		if filters.EndDateTo != "" {
			endDate, err := time.Parse("2006-01-02", filters.EndDateTo)
			if err != nil {
				return nil, fmt.Errorf("invalid end date to")
			}
			q = q.Where("end_date <= ?", endDate)
		}

		if filters.StartDateFrom != "" {
			startDate, err := time.Parse("2006-01-02", filters.StartDateFrom)
			if err != nil {
				return nil, fmt.Errorf("invalid start date from")
			}
			q = q.Where("start_date >= ?", startDate)
		}

		if filters.StartDateTo != "" {
			startDate, err := time.Parse("2006-01-02", filters.StartDateTo)
			if err != nil {
				return nil, fmt.Errorf("invalid start date to")
			}
			q = q.Where("start_date <= ?", startDate)
		}

		if filters.LastUpdate != "" {
			lastUpdate, err := time.Parse("2006-01-02 15:04:05", filters.LastUpdate)
			if err != nil {
				return nil, fmt.Errorf("invalid last update")
			}
			q = q.Where("updated_at >= ?", lastUpdate)
		}
	}

	pageInfo, err := app.PageInfo(q, filters.PaginationInput)

	if err != nil {
		return nil, err
	}

	data.PageInfo = pageInfo

	q = q.Scopes(app.Paginate(filters.PaginationInput))

	if err := q.Find(&data.Results).Error; err != nil {
		return nil, err
	}

	return data, nil
}

type ActivityCreateData struct {
	TaxCode      *string                `json:"tax_code,omitempty"`
	ExperienceID *uint                  `json:"experience_id,omitempty"`
	StartDate    *string                `json:"start_date,omitempty"`
	EndDate      *string                `json:"end_date,omitempty"`
	StartTime    *string                `json:"start_time,omitempty"`
	EndTime      *string                `json:"end_time,omitempty"`
	Message      *string                `json:"message,omitempty"`
	ExternalID   *string                `json:"external_id,omitempty"`
	Status       *models.ActivityStatus `json:"status,omitempty"`
}

func ActivityCreate(ctx *app.Context, data *ActivityCreateData) (*models.Activity, error) {
	err := error(nil)

	// todo check roles

	if data.ExternalID != nil {
		existingActivity := models.Activity{}
		if err := ActivityQuery(ctx).Where("external_id = ?", data.ExternalID).First(&existingActivity).Error; err == nil {
			return ActivityUpdate(ctx, existingActivity.ID, &ActivityUpdateData{
				ExperienceID: data.ExperienceID,
				Status:       data.Status,
				StartDate:    data.StartDate,
				EndDate:      data.EndDate,
				StartTime:    data.StartTime,
				EndTime:      data.EndTime,
				Message:      data.Message,
			})
		}

		return nil, fmt.Errorf("activity not found")
	}

	if data.TaxCode != nil && *data.TaxCode != "" {
		accounts.UserProfileUpdate(ctx.User, accounts.UserProfileUpdateData{TaxCode: data.TaxCode})
	}

	startDate := time.Time{}
	if data.StartDate != nil && *data.StartDate != "" {
		startDate, err = time.Parse("2006-01-02", *data.StartDate)
		if err != nil {
			return nil, fmt.Errorf("invalid start date")
		}
	}

	endDate := time.Time{}
	if data.EndDate != nil && *data.EndDate != "" {
		endDate, err = time.Parse("2006-01-02", *data.EndDate)
		if err != nil {
			return nil, fmt.Errorf("invalid end date")
		}
	}

	experience := models.Experience{}
	if err := experiences.ExperienceQuery(ctx).Where("id = ?", data.ExperienceID).First(&experience).Error; err != nil {
		return nil, fmt.Errorf("experience not found")
	}

	// todo is timerage valid?
	// todo is a timerange available for experience?

	// activityCheck := models.Activity{}
	// if err := ActivityQuery(ctx).Where("experience_id = ? AND user_id = ? AND status not in ('rejected','canceled') AND end_date < ? ", data.ExperienceID, ctx.User.ID, data.StartDate).First(&activityCheck).Error; err == nil {
	// 	return nil, fmt.Errorf("already enrolled")
	// }

	activity := models.Activity{
		UserID:         ctx.User.ID,
		ExperienceID:   *data.ExperienceID,
		OrganizationID: experience.OrganizationID,
		StartTime:      *data.StartTime,
		EndTime:        *data.EndTime,
		Message:        *data.Message,
	}

	if startDate != (time.Time{}) {
		activity.StartDate = &startDate
	}

	if endDate != (time.Time{}) {
		activity.EndDate = &endDate
	}

	if err := app.DB.Create(&activity).Error; err != nil {
		return nil, err
	}

	events.Publish(events.Event{
		Type: events.ActivityCreated,
		Payload: events.EventPayload{
			Data: &events.ActivityNotificationEventPayload{
				Activity: &activity,
				User:     ctx.User,
			},
		},
	})

	return &activity, nil
}

type ActivityUpdateData struct {
	ExperienceID *uint                  `json:"experience_id,omitempty"`
	Status       *models.ActivityStatus `json:"status,omitempty"`
	StartDate    *string                `json:"start_date,omitempty"`
	EndDate      *string                `json:"end_date,omitempty"`
	StartTime    *string                `json:"start_time,omitempty"`
	EndTime      *string                `json:"end_time,omitempty"`
	Message      *string                `json:"message,omitempty"`
	ExternalID   *string                `json:"external_id,omitempty"`
}

func ActivityUpdate(ctx *app.Context, id uint, data *ActivityUpdateData) (*models.Activity, error) {
	var activity models.Activity

	var newActvityStatus models.ActivityStatus

	// todo check roles

	if err := ActivityQuery(ctx).Where("id = ?", id).First(&activity).Error; err != nil {
		return nil, err
	}

	if data.StartDate != nil {
		fmt.Printf("data.StartDate: %v\n", *data.StartDate)
		startDate, err := time.Parse("2006-01-02", *data.StartDate)

		if err != nil {
			fmt.Printf("err: %v\n", err)
			return nil, fmt.Errorf("invalid start date")
		}
		fmt.Printf("startDate: %v\n", startDate)
		activity.StartDate = &startDate
	}

	if data.EndDate != nil {
		endDate, err := time.Parse("2006-01-02", *data.EndDate)
		if err != nil {
			return nil, fmt.Errorf("invalid end date")
		}
		activity.EndDate = &endDate
	}

	if data.StartTime != nil {
		activity.StartTime = *data.StartTime
	}

	if data.EndTime != nil {
		activity.EndTime = *data.EndTime
	}

	if data.Message != nil {
		activity.Message = *data.Message
	}

	if data.ExperienceID != nil {
		activity.ExperienceID = *data.ExperienceID
	}

	if data.ExternalID != nil {
		activity.ExternalID = *data.ExternalID
	}

	if data.Status != nil && activity.Status != *data.Status {
		if ctx.Role == app.RoleSuperUser || (*data.Status == "canceled" && ctx.User.ID == activity.User.ID) {
			activity.Status = *data.Status
			newActvityStatus = *data.Status

		}
	}

	if err := app.DB.Save(&activity).Error; err != nil {
		return nil, err
	}

	if newActvityStatus != "" {
		var eventType events.EventType

		if newActvityStatus == models.ActivityApproved {
			eventType = events.ActivityAccepted
		}

		if newActvityStatus == models.ActivityRejected {
			eventType = events.ActivityRejected
		}

		if eventType != "" {
			events.Publish(events.Event{
				Type: eventType,
				Payload: events.EventPayload{
					Data: &events.ActivityNotificationEventPayload{
						Activity: &activity,
						User:     &activity.User,
					},
				},
			})
		}
	}

	return &activity, nil
}

func ActivityDelete(ctx *app.Context, id uint) error {
	var activity models.Activity

	if err := ActivityQuery(ctx).Where("id = ?", id).First(&activity).Error; err != nil {
		return err
	}

	if err := app.DB.Delete(&activity).Error; err != nil {
		return err
	}

	return nil
}
