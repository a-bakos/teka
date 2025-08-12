package models

import "time"

type Item struct {
	ID          int
	Title       string
	Description string
	ItemType    string
	CreatedAt   time.Time
	UpdatedAt   *time.Time
	CreatedBy   int
	UpdatedBy   *int
}
