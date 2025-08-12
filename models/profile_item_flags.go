package models

import "time"

type ProfileItemFlags struct {
	ProfileID  int
	ItemID     int
	Status     string // Not started, In progress, Completed
	IsFavorite bool
	Notes      *string
	UpdatedAt  time.Time
}
