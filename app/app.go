package app

import (
	"fmt"
	"teka/app/services"
)

type App struct {
	Config AppConfig
}

func (a App) Run() {

	// New profile definition
	// newProfile := services.NewProfile("Columbo", nil) // this collects input from the user

	// Profile add
	// _ = services.CreateProfile(&newProfile) // returns profile ID

	// Profile delete
	// _ = services.DeleteProfile(repository.DeleteProfileById, "2")

	// New book definition
	// newbook := services.NewBook() // this collects all the data from the user

	// Book add
	// _ = services.CreateBook(&newbook) // returns book id

	// Get all books
	// services.GetBooks()

	// Delete book by book id
	//r := services.DeleteBook("20")
	//fmt.Println(r)

	p, _ := services.GetProfileById("1")
	fmt.Println(p)

	p2, _ := services.GetProfileByName("Adam")
	fmt.Println(p2)

	p3, _ := services.GetProfileByName("AA")
	fmt.Println(p3)
}

// methods exposed to JS via Wails
