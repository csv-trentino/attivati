package categories

import (
	"strings"

	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
	"gorm.io/gorm"
)

func CategoryQuery(ctx *app.Context) *gorm.DB {
	q := app.DB.Model(&models.Category{})

	return q
}

func CategoryGet(ctx *app.Context, id uint) (*models.Category, error) {
	var category models.Category

	if err := CategoryQuery(ctx).Where("id = ?", id).First(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

type CategoryListData struct {
	Results []models.Category `json:"results"`
}

type CategoryFilters struct {
	Query string `query:"q"`
}

func CategoryList(ctx *app.Context, filters *CategoryFilters) (*CategoryListData, error) {

	var categories []models.Category

	q := CategoryQuery(ctx)

	if filters != nil {
		if filters.Query != "" {
			q = q.Where("name LIKE ?", "%"+filters.Query+"%")
		}
	}

	if err := q.Find(&categories).Error; err != nil {
		return nil, err
	}

	return &CategoryListData{
		Results: categories,
	}, nil
}

type CategoryCreateData struct {
	Name string `json:"name"`
	Code string `json:"code,omitempty"`
}

func CategoryCreate(ctx *app.Context, data *CategoryCreateData) (*models.Category, error) {
	code := strings.ToLower(data.Name)
	code = strings.ReplaceAll(code, " ", "")

	category := models.Category{
		Name: data.Name,
		Code: code,
	}

	if err := app.DB.Create(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

type CategoryUpdateData struct {
	Name string `json:"name"`
	Code string `json:"code,omitempty"`
}

func CategoryUpdate(ctx *app.Context, id uint, data *CategoryUpdateData) (*models.Category, error) {
	var category models.Category

	if err := CategoryQuery(ctx).Where("id = ?", id).First(&category).Error; err != nil {
		return nil, err
	}

	if data.Code != "" {
		category.Code = data.Code
	}

	if data.Name != "" {
		category.Name = data.Name
	}

	if err := app.DB.Save(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func CategoryDelete(ctx *app.Context, id uint) error {
	var activity models.Category

	if err := CategoryQuery(ctx).Where("id = ?", id).First(&activity).Error; err != nil {
		return err
	}

	if err := app.DB.Delete(&activity).Error; err != nil {
		return err
	}

	return nil
}
