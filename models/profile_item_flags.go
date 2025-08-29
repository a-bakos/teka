package models

import "time"

type ProfileItemFlags struct {
	ProfileID  int       `json:"profile_id"`
	ItemID     int       `json:"item_id"`
	Status     string    `json:"status"` // Not started, In progress, Completed
	IsFavorite bool      `json:"is_favorite"`
	Notes      *string   `json:"notes"`
	UpdatedAt  time.Time `json:"updated_at"`
}
