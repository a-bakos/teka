package app

import (
	"fmt"
	"log"
	"teka/app/services"
	"teka/constants"
)

func Run() {

	if constants.CliMode {
		fmt.Println("Running in CLI mode")
		// book.CmdAddBook()
	} else {
		fmt.Println("Running in GUI mode")
		runGui()
	}
	//
	//rows, err := db.Conn.Query(`
	//	SELECT item_id, isbn, publisher, published_date, page_count
	//	FROM books
	//`)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//defer rows.Close()
	//
	//for rows.Next() {
	//	var id int
	//	var isbn sql.NullString
	//	var publisher sql.NullString
	//	var publishedDate sql.NullTime
	//	var pageCount sql.NullInt64
	//
	//	err = rows.Scan(&id, &isbn, &publisher, &publishedDate, &pageCount)
	//	if err != nil {
	//		log.Fatal(err)
	//	}
	//
	//	fmt.Printf(
	//		"ID: %d, ISBN: %v, Publisher: %v, Published: %v, Page count: %v\n",
	//		id,
	//		util.NullableToStringDisplay(isbn),
	//		util.NullableToStringDisplay(publisher),
	//		util.NullableToTimeDisplay(publishedDate),
	//		util.NullableToIntDisplay(pageCount),
	//	)
	//}
	//
	//if err = rows.Err(); err != nil {
	//	log.Fatal(err)
	//}

	newbook := services.CreateBook() // this collects all the data from the user
	itemID, err := services.AddBook(&newbook)
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
