package app

import (
	"fmt"
	"teka/app/services"
	"teka/constants"
	"teka/util"
)

type App struct {
	Config AppConfig
}

func (a App) Run() {

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

	newProfile := services.NewProfile("John Doe") // this collects input from the user
	profileID, err := services.CreateProfile(&newProfile)
	if err != nil {
		util.Logger("Failed: %v", err)
	}
	util.Logger("End for profile ID: %d", profileID)

	newbook := services.NewBook() // this collects all the data from the user
	itemID, err := services.CreateBook(&newbook)
	if err != nil {
		util.Logger("Failed: %v", err)
	}
	util.Logger("End for book ID: %d", itemID)
}

func runGui() {
	fmt.Println("Starting GUI application...")
	// Initialize and run GUI application here
}

// methods exposed to JS via Wails
