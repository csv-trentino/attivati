package models

import (
	"time"
)

type ActivityStatus string

const (
	ActivityPending  ActivityStatus = "pending"
	ActivityApproved ActivityStatus = "approved"
	ActivityRejected ActivityStatus = "rejected"
	ActivityCanceled ActivityStatus = "canceled"
)

type Activity struct {
	ID             uint           `json:"id" gorm:"primaryKey"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	UserID         uint           `json:"-"`
	User           User           `json:"user"`
	ExperienceID   uint           `json:"-"`
	Experience     Experience     `json:"experience"`
	OrganizationID uint           `json:"-"`
	Organization   Organization   `json:"-"`
	StartDate      *time.Time     `json:"start_date"`
	EndDate        *time.Time     `json:"end_date"`
	StartTime      string         `json:"start_time"`
	EndTime        string         `json:"end_time"`
	Status         ActivityStatus `json:"status" gorm:"type:varchar(20);default:pending"` // pending, approved, rejected
	Message        string         `json:"message" gorm:"type:text"`
	ExternalID     string         `json:"external_id"`
}
