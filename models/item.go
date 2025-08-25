package models

import "time"

type Item struct {
	ID          int        `json:"item_id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	ItemType    string     `json:"item_type"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
	CreatedBy   int        `json:"created_by"`
	UpdatedBy   *int       `json:"updated_by"`
}
