package models

import (
	"strings"
	"teka/constants"
	"time"
	"unicode"
)

// * = nullable field

type Book struct {
	Item
	Publisher     *string    `json:"publisher"`
	PublishedDate *time.Time `json:"published_date"`
	PageCount     *int       `json:"page_count"`
	ISBN          *string    `json:"isbn"`
	AuthorNames   string     `json:"author_names"` // e.g. "Alice + Bob"
}

func (b Book) HasValidIsbn() bool {
	// ISBN is ten digits long if assigned before 2007,
	// thirteen digits long if assigned on or after 1 January 2007 (w/o separator)
	// Separator can be a hyphen or a space

	if b.ISBN == nil {
		return false
	}

	isbn := strings.TrimSpace(*b.ISBN)
	isbn = strings.ReplaceAll(isbn, "-", constants.EmptyString)
	isbn = strings.ReplaceAll(isbn, " ", constants.EmptyString)

	isbnMinLen := 10
	isbnMaxLen := 13

	if len(isbn) < isbnMinLen || len(isbn) > isbnMaxLen {
		return false
	}

	for _, v := range isbn {
		if !unicode.IsNumber(v) {
			return false
		}
	}

	return true
}

// sketch
type Magazine struct {
	Item
	Publisher     *string
	PublishedDate *time.Time
	PageCount     *int
	ISSN          *string
	AuthorNames   string // e.g. "Alice + Bob"
}

type ItemDetails struct {
	Publisher     *string
	PublishedDate *time.Time
	PageCount     *int
	AuthorNames   string // e.g. "Alice + Bob"
}
