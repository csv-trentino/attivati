package models

import (
	"time"
)

type Experience struct {
	ID             uint         `json:"id" gorm:"primarykey"`
	UID            string       `json:"uid" gorm:"uniqueIndex"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
	OrganizationID uint         `json:"organization_id"`
	Organization   Organization `json:"organization" gorm:"OnDelete:SET NULL"`
	Title          string       `json:"title"`
	Description    string       `json:"description"`
	Image          string       `json:"image"`
	CategoryID     uint         `json:"category_id"`
	Category       Category     `json:"category"`
	Skills         string       `json:"skills"`

	// Location
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Address   string  `json:"address"`
	City      string  `json:"city"`
	State     string  `json:"state"`
	ZipCode   string  `json:"zip_code"`
	Country   string  `json:"country"`

	//Contact
	ContactName                string `json:"contact_name"`
	ContactEmail               string `json:"contact_email"`
	ContactPhone               string `json:"contact_phone"`
	PostEnrollmentInstructions string `json:"post_enrollment_instructions"`

	// Dates
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`

	// Hours
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`

	// Recurrence
	IsRecurring bool `json:"is_recurring"`
	Monday      bool `json:"monday"`
	Tuesday     bool `json:"tuesday"`
	Wednesday   bool `json:"wednesday"`
	Thursday    bool `json:"thursday"`
	Friday      bool `json:"friday"`
	Saturday    bool `json:"saturday"`
	Sunday      bool `json:"sunday"`

	// Visibility
	Published bool `json:"published"`

	ExternalID string `json:"external_id"`
}
