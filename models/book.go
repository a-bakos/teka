package models

import "time"

// * = nullable field

type Book struct {
	Item
	Publisher     *string
	PublishedDate *time.Time
	PageCount     *int
	ISBN          *string
	AuthorNames   string  // new: input from user, e.g. "Alice + Bob"
	AuthorIDs     []int64 // optional: IDs of authors just created
}
