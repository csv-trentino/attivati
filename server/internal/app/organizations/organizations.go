package organizations

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/app/events"
	"github.com/wevolunteer/wevolunteer/internal/models"
	"gorm.io/gorm"
)

type ExtendedOrganization struct {
	models.Organization

	IsFavorite bool `json:"is_favorite"`
}

func OrganizationQuery(c *app.Context) *gorm.DB {
	q := app.DB.Model(&models.Organization{})
	q = q.Preload("Category")

	if c.Role != app.RoleSuperUser {
		q = q.Where("published = ?", true)
	}

	return q
}

func OrganizationGet(c *app.Context, id uint) (*ExtendedOrganization, error) {
	var organization ExtendedOrganization

	if err := OrganizationQuery(c).
		Select("organizations.*, COALESCE(favorite_organizations.user_id IS NOT NULL, false) AS is_favorite").
		Joins("LEFT JOIN favorite_organizations ON favorite_organizations.organization_id = organizations.id AND favorite_organizations.user_id = ?", c.User.ID).
		Where("organizations.id = ?", id).First(&organization).Error; err != nil {
		return nil, err
	}

	return &organization, nil
}

func OrganizationGetByExternalID(c *app.Context, externalId string) (*ExtendedOrganization, error) {
	var organization ExtendedOrganization

	if err := OrganizationQuery(c).
		Select("organizations.*, COALESCE(favorite_organizations.user_id IS NOT NULL, false) AS is_favorite").
		Joins("LEFT JOIN favorite_organizations ON favorite_organizations.organization_id = organizations.id AND favorite_organizations.user_id = ?", c.User.ID).
		Where("organizations.external_id = ?", externalId).First(&organization).Error; err != nil {
		return nil, err
	}

	return &organization, nil
}

type OrganizationFilters struct {
	app.PaginationInput
	Query    string `query:"q"`
	Favorite bool   `query:"favorite"`
}

type OrganizationListData struct {
	Results  []ExtendedOrganization `json:"results"`
	PageInfo *app.PaginationInfo    `json:"page_info"`
}

func OrganizationsList(c *app.Context, filters *OrganizationFilters) (*OrganizationListData, error) {
	data := &OrganizationListData{}

	q := OrganizationQuery(c)

	q = q.
		Select("organizations.*, COALESCE(favorite_organizations.user_id IS NOT NULL, false) AS is_favorite").
		Joins("LEFT JOIN favorite_organizations ON favorite_organizations.organization_id = organizations.id AND favorite_organizations.user_id = ?", c.User.ID)

	if filters != nil {
		if filters.Query != "" {
			q = q.Where("name ILIKE ?", "%"+filters.Query+"%")
		}

		if filters.Favorite {
			q = q.Where("favorite_organizations.user_id IS NOT NULL")
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

	// if filters.Favorite {
	// 	if err := q.Table("organizations").
	// 		Select("organizations.*, true AS is_favorite").
	// 		Where("organizations.published = ? AND organizations.deleted_at IS NULL AND favorite_organizations.user_id = ?", true, c.User.ID).
	// 		Find(&data.Results).Error; err != nil {
	// 		return nil, err
	// 	}
	// } else {
	// 	if err := q.Table("organizations").
	// 		Select("organizations.*, COALESCE(favorite_organizations.user_id IS NOT NULL, false) AS is_favorite").
	// 		Joins("LEFT JOIN favorite_organizations ON favorite_organizations.organization_id = organizations.id AND favorite_organizations.user_id = ?", c.User.ID).
	// 		Where("organizations.published = ? AND organizations.deleted_at IS NULL", true).
	// 		Find(&data.Results).Error; err != nil {
	// 		return nil, err
	// 	}
	// }

	return data, nil
}

type OrganizationCreateData struct {
	Name       string   `json:"name"`
	Logo       *string  `json:"logo,omitempty"`
	Tagline    *string  `json:"tagline,omitempty"`
	Email      *string  `json:"email"`
	WebSite    *string  `json:"website,omitempty"`
	Phone      *string  `json:"phone,omitempty"`
	Address    *string  `json:"address,omitempty"`
	CategoryID uint     `json:"category_id,omitempty"`
	City       *string  `json:"city,omitempty"`
	State      *string  `json:"state,omitempty"`
	ZipCode    *string  `json:"zip_code,omitempty"`
	Country    *string  `json:"country,omitempty"`
	Latitude   *float64 `json:"latitude,omitempty"`
	Longitude  *float64 `json:"longitude,omitempty"`
	TaxCode    *string  `json:"tax_code,omitempty"`
	VATCode    *string  `json:"vat_code,omitempty"`
	ExternalId *string  `json:"external_id,omitempty"`
	Published  *bool    `json:"published,omitempty"`
}

func OrganizationCreate(c *app.Context, data *OrganizationCreateData) (*models.Organization, error) {
	fmt.Printf("data: %v\n", data)
	uuid := uuid.New()

	existingOrganization := models.Organization{}

	if data.ExternalId != nil {
		if err := app.DB.Where("external_id = ?", *data.ExternalId).First(&existingOrganization).Error; err == nil {
			fmt.Printf("existingOrganization\n")
			return OrganizationUpdate(
				c,
				existingOrganization.ID,
				&OrganizationUpdateData{
					Name:       data.Name,
					Logo:       data.Logo,
					Tagline:    data.Tagline,
					Email:      data.Email,
					WebSite:    data.WebSite,
					Phone:      data.Phone,
					CategoryID: data.CategoryID,
					Address:    data.Address,
					City:       data.City,
					State:      data.State,
					ZipCode:    data.ZipCode,
					Country:    data.Country,
					Latitude:   data.Latitude,
					Longitude:  data.Longitude,
					TaxCode:    data.TaxCode,
					VATCode:    data.VATCode,
					ExternalId: data.ExternalId,
				},
			)
		}
	}

	organization := models.Organization{
		Name:       data.Name,
		UID:        uuid.String(),
		Published:  true,
		CategoryID: &data.CategoryID,
	}

	if data.Logo != nil {
		organization.Logo = *data.Logo
	}

	if data.Tagline != nil {
		organization.Tagline = *data.Tagline
	}

	if data.Email != nil {
		organization.Email = *data.Email
	}

	if data.WebSite != nil {
		organization.WebSite = *data.WebSite
	}

	if data.Phone != nil {
		organization.Phone = *data.Phone
	}

	if data.Address != nil {
		organization.Address = *data.Address
	}

	if data.City != nil {
		organization.City = *data.City
	}

	if data.State != nil {
		organization.State = *data.State
	}

	if data.ZipCode != nil {
		organization.ZipCode = *data.ZipCode
	}

	if data.Country != nil {
		organization.Country = *data.Country
	}

	if data.Latitude != nil {
		organization.Latitude = *data.Latitude
	}

	if data.Longitude != nil {
		organization.Longitude = *data.Longitude
	}

	if data.TaxCode != nil {
		organization.TaxCode = *data.TaxCode
	}

	if data.VATCode != nil {
		organization.VATCode = *data.VATCode
	}

	if data.ExternalId != nil {
		organization.ExternalId = *data.ExternalId
	}

	if err := app.DB.Create(&organization).Error; err != nil {
		fmt.Printf("error: %v\n", err)
		return nil, err
	}

	return &organization, nil
}

type OrganizationUpdateData struct {
	Name       string   `json:"name"`
	Logo       *string  `json:"logo,omitempty"`
	Tagline    *string  `json:"tagline,omitempty"`
	Email      *string  `json:"email"`
	WebSite    *string  `json:"website,omitempty"`
	Phone      *string  `json:"phone,omitempty"`
	Address    *string  `json:"address,omitempty"`
	CategoryID uint     `json:"category_id,omitempty"`
	City       *string  `json:"city,omitempty"`
	State      *string  `json:"state,omitempty"`
	ZipCode    *string  `json:"zip_code,omitempty"`
	Country    *string  `json:"country,omitempty"`
	Latitude   *float64 `json:"latitude,omitempty"`
	Longitude  *float64 `json:"longitude,omitempty"`
	TaxCode    *string  `json:"tax_code,omitempty"`
	VATCode    *string  `json:"vat_code,omitempty"`
	ExternalId *string  `json:"external_id,omitempty"`
	Published  *bool    `json:"published,omitempty"`
}

func OrganizationUpdate(c *app.Context, id uint, data *OrganizationUpdateData) (*models.Organization, error) {
	var organization models.Organization

	if err := OrganizationQuery(c).Where("id = ?", id).First(&organization).Error; err != nil {
		return nil, &app.ErrNotAuthorized{
			Message: err.Error(),
		}
	}

	if data.Name != "" {
		organization.Name = data.Name
	}

	if data.Logo != nil {
		organization.Logo = *data.Logo
	}

	if data.Tagline != nil {
		organization.Tagline = *data.Tagline
	}

	if data.CategoryID != 0 {
		organization.CategoryID = &data.CategoryID
	}

	if data.Email != nil {
		organization.Email = *data.Email
	}

	if data.WebSite != nil {
		organization.WebSite = *data.WebSite
	}

	if data.Phone != nil {
		organization.Phone = *data.Phone
	}

	if data.Address != nil {
		organization.Address = *data.Address
	}

	if data.City != nil {
		organization.City = *data.City
	}

	if data.State != nil {
		organization.State = *data.State
	}

	if data.ZipCode != nil {
		organization.ZipCode = *data.ZipCode
	}

	if data.Country != nil {
		organization.Country = *data.Country
	}

	if data.Latitude != nil {
		organization.Latitude = *data.Latitude
	}

	if data.Longitude != nil {
		organization.Longitude = *data.Longitude
	}

	if data.TaxCode != nil {
		organization.TaxCode = *data.TaxCode
	}

	if data.VATCode != nil {
		organization.VATCode = *data.VATCode
	}

	if data.ExternalId != nil {
		organization.ExternalId = *data.ExternalId
	}

	if data.Published != nil {
		organization.Published = *data.Published
	}

	if err := app.DB.Save(&organization).Error; err != nil {
		return nil, err
	}

	return &organization, nil
}

func OrganizationDelete(c *app.Context, id uint) error {
	var organization models.Organization

	if c.Role != app.RoleSuperUser {
		return &app.ErrNotAuthorized{
			Message: fmt.Sprintf("role %s is not authorized to delete organizations", c.Role),
		}
	}

	if err := OrganizationQuery(c).Where("id = ?", id).First(&organization).Error; err != nil {
		return &app.ErrNotAuthorized{
			Message: fmt.Sprintf("role %s is not authorized to delete organizations", c.Role),
		}
	}

	if err := app.DB.Delete(&organization).Error; err != nil {
		return err
	}

	return nil
}

func OrganizationFollow(c *app.Context, id uint) error {
	var organization models.Organization

	if err := OrganizationQuery(c).Where("id = ?", id).First(&organization).Error; err != nil {
		return err
	}

	var user models.User
	if err := app.DB.Model(&user).Where("id = ?", c.User.ID).First(&user).Error; err != nil {
		return err
	}

	if err := app.DB.Model(&organization).Association("FavoriteUsers").Append(&user); err != nil {
		return err
	}

	events.Publish(events.Event{
		Type: events.UserFollowOrg,
		Payload: events.EventPayload{
			Data: &events.UserFollowOrgPayload{
				User:         c.User,
				Organization: &organization,
			},
		},
	})

	return nil
}

func OrganizationUnfollow(c *app.Context, id uint) error {
	var organization models.Organization

	if err := OrganizationQuery(c).Where("id = ?", id).First(&organization).Error; err != nil {
		return err
	}

	var user models.User
	if err := app.DB.Model(&user).Where("id = ?", c.User.ID).First(&user).Error; err != nil {
		return err
	}

	if err := app.DB.Model(&organization).Association("FavoriteUsers").Delete(&user); err != nil {
		return err
	}

	events.Publish(events.Event{
		Type: events.UserUnfollowOrg,
		Payload: events.EventPayload{
			Data: &events.UserFollowOrgPayload{
				User:         c.User,
				Organization: &organization,
			},
		},
	})

	return nil
}
