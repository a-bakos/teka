package main

import (
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"teka/models"
	"teka/util"
	"time"
)

func main() {

	p := models.Profile{
		ID:   1,
		Name: "John Doe",
	}
	fmt.Println(p.Name)

	book := models.Book{
		Item: models.Item{
			ID:          1,
			Title:       "Go Programming",
			Description: "A book about Go programming language",
			ItemType:    "Book",
			CreatedAt:   time.Now(),
			UpdatedAt:   nil,
			CreatedBy:   p.ID,
			UpdatedBy:   nil,
		},
		Publisher:     util.PointerString("Publisher"),
		PublishedDate: util.PointerTime(time.Date(2023, 10, 1, 0, 0, 0, 0, time.UTC)),
		PageCount:     util.PointerInt(300),
		ISBN:          util.PointerString("978-3-16-148410-0"),
	}

	fmt.Printf("Book Title: %s\n", book.Title)
	fmt.Printf("Created by: %d\n", book.CreatedBy)

	db, err := sql.Open("sqlite3", "./temp/tekatest.db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT item_id, isbn, publisher, published_date, page_count
		FROM books
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	// Assuming your 'books' table has columns: id, title, author, published_date
	for rows.Next() {
		var id int
		var isbn sql.NullString
		var publisher sql.NullString
		var publishedDate sql.NullTime
		var pageCount sql.NullInt64 // Use sql.NullInt64 for nullable integers

		err = rows.Scan(&id, &isbn, &publisher, &publishedDate, &pageCount)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf(
			"ID: %d, ISBN: %v, Publisher: %v, Published: %v, Page count: %v\n",
			id,
			nullableToString(isbn),
			nullableToString(publisher),
			nullableToTime(publishedDate),
			nullableToInt(pageCount),
		)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}
}

// can't directly print nullables

func nullableToString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return "(null)"
}

func nullableToTime(nt sql.NullTime) string {
	if nt.Valid {
		return nt.Time.Format("2006-01-02")
	}
	return "(null)"
}

func nullableToInt(ni sql.NullInt64) string {
	if ni.Valid {
		return fmt.Sprintf("%d", ni.Int64)
	}
	return "(null)"
}
