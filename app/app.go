package app

import (
	"database/sql"
	"fmt"
	"log"
	"teka/constants"
	"teka/db"
	"teka/util"
)

func Run() {

	if constants.CliMode {
		fmt.Println("Running in CLI mode")
		// Here you would call your CLI commands, e.g.:
		// book.CmdAddBook()
	} else {
		fmt.Println("Running in GUI mode")
		// Here you would initialize and run your GUI application
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
			util.NullableToString(isbn),
			util.NullableToString(publisher),
			util.NullableToTime(publishedDate),
			util.NullableToInt(pageCount),
		)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}

}

func runGui() {
	fmt.Println("Starting GUI application...")
	// Initialize and run GUI application here
}

// methods exposed to JS via Wails
