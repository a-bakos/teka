package app

import (
	"database/sql"
	"fmt"
	"log"
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
	"time"
)

func Run() {

	if constants.CliMode {
		fmt.Println("Running in CLI mode")
		// book.CmdAddBook()
	} else {
		fmt.Println("Running in GUI mode")
		runGui()
	}

	rows, err := db.Conn.Query(`
		SELECT item_id, isbn, publisher, published_date, page_count
		FROM books
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var isbn sql.NullString
		var publisher sql.NullString
		var publishedDate sql.NullTime
		var pageCount sql.NullInt64

		err = rows.Scan(&id, &isbn, &publisher, &publishedDate, &pageCount)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf(
			"ID: %d, ISBN: %v, Publisher: %v, Published: %v, Page count: %v\n",
			id,
			util.NullableToStringDisplay(isbn),
			util.NullableToStringDisplay(publisher),
			util.NullableToTimeDisplay(publishedDate),
			util.NullableToIntDisplay(pageCount),
		)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

	// Deal with published date
	parsedPublished, err := time.Parse(time.RFC3339, "2020-01-01T00:00:00Z")
	var published *time.Time
	if err == nil {
		published = util.PointerTime(parsedPublished)
	} else {
		published = nil
	}

	newbook := models.Book{
		Item: models.Item{
			Title:       "Sample Book",
			Description: "This is a sample book description.",
			ItemType:    constants.ItemTypeBook,
			CreatedBy:   1,
		},
		Publisher:     util.PointerString("Sample Publisher"),
		PublishedDate: published,
		PageCount:     util.PointerInt(300),
		ISBN:          util.PointerString("978-3-16-148410-0"),
	}
	itemID, err := repository.InsertBook(&newbook, "Author three + Author four + author five")
	if err != nil {
		log.Fatalf("Failed to insert book: %v", err)
	}
	fmt.Printf("Inserted new book with ID: %d\n", itemID)

}

func runGui() {
	fmt.Println("Starting GUI application...")
	// Initialize and run GUI application here
}

// methods exposed to JS via Wails
