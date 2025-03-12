package experiences

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/app/events"
	"github.com/wevolunteer/wevolunteer/internal/app/organizations"
	"github.com/wevolunteer/wevolunteer/internal/models"
	"gorm.io/gorm"
)

func ExperienceQuery(ctx *app.Context) *gorm.DB {
	q := app.DB.Model(&models.Experience{})
	q = q.Preload("Category")
	q = q.Preload("Organization")

	return q
}

func ExperienceGet(c *app.Context, id uint) (*models.Experience, error) {
	var experience models.Experience

	if err := ExperienceQuery(c).Where("id = ?", id).First(&experience).Error; err != nil {
		return nil, err
	}

	return &experience, nil
}

type ExperienceListData struct {
	Results  []models.Experience `json:"results"`
	PageInfo *app.PaginationInfo `json:"page_info"`
}

type ExperienceFilters struct {
	app.PaginationInput
	Query        string  `query:"q"`
	Latitude     float64 `query:"lat"`
	Longitude    float64 `query:"lng"`
	DateStart    string  `query:"date_start"`
	DateEnd      string  `query:"date_end"`
	Categories   []uint  `query:"categories"`
	Published    bool    `query:"published,omitempty"`
	Organization uint    `query:"organization"`
}

func ExperienceList(ctx *app.Context, filters *ExperienceFilters) (*ExperienceListData, error) {
	data := &ExperienceListData{}

	q := ExperienceQuery(ctx)

	if filters != nil {
		if filters.DateStart != "" && filters.DateEnd != "" {
			filters.DateEnd = filters.DateStart
		}

		if filters.DateStart != "" {
			q = q.Where("end_date >= ?", filters.DateStart)
		}

		if filters.DateEnd != "" {
			q = q.Where("start_date <= ?", filters.DateEnd)
		}

		if filters.Latitude != 0 && filters.Longitude != 0 {
			q = q.Order(fmt.Sprintf(
				"ST_Distance(ST_SetSRID(ST_Point(experiences.longitude, experiences.latitude), 4326)::geography, ST_SetSRID(ST_Point(%f, %f), 4326)::geography) ASC",
				filters.Longitude, filters.Latitude))
		}

		if filters.Query != "" {

			q = q.
				Joins("LEFT JOIN organizations on organizations.id = experiences.organization_id").
				Where("(experiences.title ILIKE ? OR organizations.name ILIKE ?)", "%"+filters.Query+"%", "%"+filters.Query+"%")
		}

		if len(filters.Categories) > 0 {
			q = q.Where("category_id IN ?", filters.Categories)
		}

		if filters.Organization > 0 {
			q = q.Where("organization_id = ?", filters.Organization)
		}

		if filters.Published {
			q = q.Where("experiences.published = ?", filters.Published)
		}
	}

	if ctx.Role == app.RolePublic || ctx.Role == app.RoleVolunteer {
		q.Where("published = ?", true)
		q.Where("end_date >= ?", time.Now())
	}

	q.Order("start_date DESC")

	pageInfo, err := app.PageInfo(q, filters.PaginationInput)

	if err != nil {
		return nil, err
	}

	data.PageInfo = pageInfo

	q = q.Scopes(app.Paginate(filters.PaginationInput))

	if err := q.Debug().Find(&data.Results).Error; err != nil {
		return nil, err
	}

	return data, nil
}

type ExperienceCreateData struct {
	Title string `json:"title"`

	OrganizationID         uint   `json:"organization_id,omitempty"`
	OrganizationExternalID string `json:"organization_external_id,omitempty"`

	Description                string  `json:"description"`
	Image                      string  `json:"image,omitempty"`
	CategoryID                 uint    `json:"category_id,omitempty"`
	Latitude                   float64 `json:"latitude,omitempty"`
	Longitude                  float64 `json:"longitude,omitempty"`
	Address                    string  `json:"address,omitempty"`
	City                       string  `json:"city,omitempty"`
	State                      string  `json:"state,omitempty"`
	ZipCode                    string  `json:"zip_code,omitempty"`
	Country                    string  `json:"country,omitempty"`
	ContactName                string  `json:"contact_name,omitempty"`
	ContactEmail               string  `json:"contact_email,omitempty"`
	ContactPhone               string  `json:"contact_phone,omitempty"`
	PostEnrollmentInstructions string  `json:"post_enrollment_instructions,omitempty"`
	Skills                     string  `json:"skills,omitempty"`

	StartDate string `json:"start_date,omitempty"`
	EndDate   string `json:"end_date,omitempty"`

	StartTime string `json:"start_time,omitempty"`
	EndTime   string `json:"end_time,omitempty"`

	IsRecurring *bool `json:"is_recurring,omitempty"`
	Monday      *bool `json:"monday,omitempty"`
	Tuesday     *bool `json:"tuesday,omitempty"`
	Wednesday   *bool `json:"wednesday,omitempty"`
	Thursday    *bool `json:"thursday,omitempty"`
	Friday      *bool `json:"friday,omitempty"`
	Saturday    *bool `json:"saturday,omitempty"`
	Sunday      *bool `json:"sunday,omitempty"`

	Published bool `json:"published,omitempty"`

	ExternalID string `json:"external_id,omitempty"`
}

func ExperienceCreate(ctx *app.Context, data *ExperienceCreateData) (*models.Experience, error) {
	var err error
	var startDate time.Time
	var endDate time.Time

	if data.OrganizationExternalID != "" {
		org, err := organizations.OrganizationGetByExternalID(ctx, data.OrganizationExternalID)
		if err != nil {
			return nil, fmt.Errorf("cannot find organization with external_id: %s", data.OrganizationExternalID)
		}

		data.OrganizationID = org.ID
	}

	if data.StartDate != "" {
		startDate, err = time.Parse("2006-01-02", data.StartDate)
		if err != nil {
			return nil, err
		}
	}

	if data.EndDate != "" {
		endDate, err = time.Parse("2006-01-02", data.EndDate)
		if err != nil {
			return nil, err
		}
	}

	if data.ExternalID != "" {
		existingExp := models.Experience{}

		if err := ExperienceQuery(ctx).Where("external_id = ?", data.ExternalID).First(&existingExp).Error; err == nil {
			return ExperienceUpdate(ctx, existingExp.ID, &ExperienceUpdateData{
				Title:                      &data.Title,
				OrganizationID:             &data.OrganizationID,
				Description:                &data.Description,
				Image:                      &data.Image,
				CategoryID:                 &data.CategoryID,
				Latitude:                   &data.Latitude,
				Longitude:                  &data.Longitude,
				Address:                    &data.Address,
				City:                       &data.City,
				State:                      &data.State,
				ZipCode:                    &data.ZipCode,
				Country:                    &data.Country,
				ContactName:                &data.ContactName,
				ContactEmail:               &data.ContactEmail,
				ContactPhone:               &data.ContactPhone,
				PostEnrollmentInstructions: &data.PostEnrollmentInstructions,
				StartDate:                  &data.StartDate,
				EndDate:                    &data.EndDate,
				StartTime:                  &data.StartTime,
				EndTime:                    &data.EndTime,
				Skills:                     &data.Skills,

				Published:  &data.Published,
				ExternalID: &data.ExternalID,
			})
		}
	}
	uuid := uuid.New().String()
	experience := models.Experience{
		Title:                      data.Title,
		UID:                        uuid,
		ExternalID:                 data.ExternalID,
		OrganizationID:             data.OrganizationID,
		Description:                data.Description,
		Image:                      data.Image,
		CategoryID:                 data.CategoryID,
		Latitude:                   data.Latitude,
		Longitude:                  data.Longitude,
		Address:                    data.Address,
		City:                       data.City,
		State:                      data.State,
		ZipCode:                    data.ZipCode,
		Country:                    data.Country,
		ContactName:                data.ContactName,
		ContactEmail:               data.ContactEmail,
		ContactPhone:               data.ContactPhone,
		PostEnrollmentInstructions: data.PostEnrollmentInstructions,
		StartDate:                  startDate,
		EndDate:                    endDate,
		StartTime:                  data.StartTime,
		EndTime:                    data.EndTime,
		Published:                  true,
		Skills:                     data.Skills,
	}

	if data.IsRecurring != nil {
		experience.IsRecurring = *data.IsRecurring
	}

	if data.Monday != nil {
		experience.Monday = *data.Monday
	}

	if data.Tuesday != nil {
		experience.Tuesday = *data.Tuesday
	}

	if data.Wednesday != nil {
		experience.Wednesday = *data.Wednesday
	}

	if data.Thursday != nil {
		experience.Thursday = *data.Thursday
	}

	if data.Friday != nil {
		experience.Friday = *data.Friday
	}

	if data.Saturday != nil {
		experience.Saturday = *data.Saturday
	}

	if data.Sunday != nil {
		experience.Sunday = *data.Sunday
	}

	if err := app.DB.Create(&experience).Error; err != nil {
		return nil, err
	}

	if err := app.DB.Preload("Organization").First(&experience, experience.ID).Error; err != nil {
		return nil, err
	}

	events.Publish(events.Event{
		Type: events.ExperienceCreated,
		Payload: events.EventPayload{
			Data: &events.ExperienceCreatedPayload{
				Experience: &experience,
			},
		},
	})

	return &experience, nil
}

type ExperienceUpdateData struct {
	Title *string `json:"title"`

	OrganizationID             *uint    `json:"organization_id,omitempty"`
	OrganizationExternalID     *string  `json:"organization_external_id,omitempty"`
	Description                *string  `json:"description"`
	Image                      *string  `json:"image,omitempty"`
	CategoryID                 *uint    `json:"category_id,omitempty"`
	Latitude                   *float64 `json:"latitude,omitempty"`
	Longitude                  *float64 `json:"longitude,omitempty"`
	Address                    *string  `json:"address,omitempty"`
	City                       *string  `json:"city,omitempty"`
	State                      *string  `json:"state,omitempty"`
	ZipCode                    *string  `json:"zip_code,omitempty"`
	Country                    *string  `json:"country,omitempty"`
	ContactName                *string  `json:"contact_name,omitempty"`
	ContactEmail               *string  `json:"contact_email,omitempty"`
	ContactPhone               *string  `json:"contact_phone,omitempty"`
	PostEnrollmentInstructions *string  `json:"post_enrollment_instructions,omitempty"`
	Skills                     *string  `json:"skills,omitempty"`

	StartDate *string `json:"start_date,omitempty"`
	EndDate   *string `json:"end_date,omitempty"`

	StartTime *string `json:"start_time,omitempty"`
	EndTime   *string `json:"end_time,omitempty"`

	IsRecurring *bool `json:"is_recurring,omitempty"`
	Monday      *bool `json:"monday,omitempty"`
	Tuesday     *bool `json:"tuesday,omitempty"`
	Wednesday   *bool `json:"wednesday,omitempty"`
	Thursday    *bool `json:"thursday,omitempty"`
	Friday      *bool `json:"friday,omitempty"`
	Saturday    *bool `json:"saturday,omitempty"`
	Sunday      *bool `json:"sunday,omitempty"`

	Published *bool `json:"published,omitempty"`

	ExternalID *string `json:"external_id,omitempty"`
}

func ExperienceUpdate(ctx *app.Context, id uint, data *ExperienceUpdateData) (*models.Experience, error) {
	var experience models.Experience

	if err := ExperienceQuery(ctx).Where("id = ?", id).First(&experience).Error; err != nil {
		return nil, err
	}

	if data.Title != nil {
		experience.Title = *data.Title
	}

	if data.OrganizationID != nil {
		experience.OrganizationID = *data.OrganizationID
	}

	if data.Description != nil {
		experience.Description = *data.Description
	}

	if data.Image != nil {
		experience.Image = *data.Image
	}

	if data.CategoryID != nil {
		experience.CategoryID = *data.CategoryID
	}

	if data.Latitude != nil {
		experience.Latitude = *data.Latitude
	}

	if data.Longitude != nil {
		experience.Longitude = *data.Longitude
	}

	if data.Address != nil {
		experience.Address = *data.Address
	}

	if data.City != nil {
		experience.City = *data.City
	}

	if data.State != nil {
		experience.State = *data.State
	}

	if data.ZipCode != nil {
		experience.ZipCode = *data.ZipCode
	}

	if data.Country != nil {
		experience.Country = *data.Country
	}

	if data.ContactName != nil {
		experience.ContactName = *data.ContactName
	}

	if data.ContactEmail != nil {
		experience.ContactEmail = *data.ContactEmail
	}

	if data.ContactPhone != nil {
		experience.ContactPhone = *data.ContactPhone
	}

	if data.PostEnrollmentInstructions != nil {
		experience.PostEnrollmentInstructions = *data.PostEnrollmentInstructions
	}

	if data.Skills != nil {
		experience.Skills = *data.Skills
	}

	if data.StartDate != nil {
		startDate, err := time.Parse("2006-01-02", *data.StartDate)
		if err != nil {
			return nil, err
		}

		experience.StartDate = startDate
	}

	if data.EndDate != nil {
		endDate, err := time.Parse("2006-01-02", *data.EndDate)
		if err != nil {
			return nil, err
		}

		experience.EndDate = endDate
	}

	if data.StartTime != nil {
		experience.StartTime = *data.StartTime
	}

	if data.EndTime != nil {
		experience.EndTime = *data.EndTime
	}

	if data.IsRecurring != nil {
		experience.IsRecurring = *data.IsRecurring
	}

	if data.Monday != nil {
		experience.Monday = *data.Monday
	}

	if data.Tuesday != nil {
		experience.Tuesday = *data.Tuesday
	}

	if data.Wednesday != nil {
		experience.Wednesday = *data.Wednesday
	}

	if data.Thursday != nil {
		experience.Thursday = *data.Thursday
	}

	if data.Friday != nil {
		experience.Friday = *data.Friday
	}

	if data.Saturday != nil {
		experience.Saturday = *data.Saturday
	}

	if data.Sunday != nil {
		experience.Sunday = *data.Sunday
	}

	if data.Published != nil {
		experience.Published = *data.Published
	}

	if data.ExternalID != nil {
		experience.ExternalID = *data.ExternalID
	}

	if err := app.DB.Save(&experience).Error; err != nil {
		return nil, err
	}

	return &experience, nil
}

func ExperienceDelete(ctx *app.Context, id uint) error {
	var experience models.Experience

	if err := ExperienceQuery(ctx).Where("id = ?", id).First(&experience).Error; err != nil {
		return err
	}

	if err := app.DB.Delete(&experience).Error; err != nil {
		return err
	}

	return nil
}
