package app

import (
	"fmt"
	"teka/app/repository"
	"teka/app/services"
	"teka/constants"
)

type App struct {
	Config AppConfig
}

func (a App) Run() {

	if constants.CliMode {
		fmt.Println("Running in CLI mode")
		// eg. book.CmdAddBook() ... todo
	} else {
		fmt.Println("Running in GUI mode")
		runGui()
	}

	// New profile definition
	newProfile := services.NewProfile("Columbo", nil) // this collects input from the user

	// Profile add
	_ = services.CreateProfile(&newProfile) // returns profile ID

	// Profile delete
	_ = services.DeleteProfile(repository.DeleteProfileById, "2")

	// New book definition
	newbook := services.NewBook() // this collects all the data from the user

	// Book add
	_ = services.CreateBook(&newbook) // returns book id

	// Get all books
	services.GetBooks()
}

func runGui() {
	fmt.Println("Starting GUI application...")
	// Initialize and run GUI application here
}

// methods exposed to JS via Wails
