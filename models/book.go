package models

import "time"

// * = nullable field

type Book struct {
	Item
	Publisher     *string
	PublishedDate *time.Time
	PageCount     *int
	ISBN          *string
	AuthorNames   string // e.g. "Alice + Bob"
}
