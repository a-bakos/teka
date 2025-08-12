package models

type ItemCreator struct {
	ItemID    int
	CreatorID int
	Role      string // e.g., "author", "editor", etc.
}
