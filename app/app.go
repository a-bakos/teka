package app

import (
	"teka/app/repository"
	"teka/app/services"
)

type App struct {
	Config AppConfig
}

func (a App) Run() {
	
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

// methods exposed to JS via Wails
