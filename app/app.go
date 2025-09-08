package app

import (
	"teka/app/services"
	"teka/util"
)

type App struct {
	Config AppConfig
}

func (a App) Run() {

	// New profile definition
	//newProfile := services.NewProfile("Columbo", nil) // this collects input from the user

	// Profile add
	//_ = services.CreateProfile(&newProfile) // returns profile ID

	// Profile delete
	// _ = services.DeleteProfile(repository.DeleteProfileById, "2")

	// Test books for bulk inserting
	//books := []models.Book{
	//	{
	//		Item: models.Item{
	//			Title:       "The Lost Kingdom",
	//			Description: "An epic fantasy novel of forgotten realms, ancient magic, and the rise of a reluctant hero.",
	//			ItemType:    constants.ItemTypeBook,
	//			CreatedBy:   2,
	//		},
	//		Publisher:     util.PointerString("Mythic Tales"),
	//		PublishedDate: util.ParsePublishedDate("2023-09-21"),
	//		PageCount:     util.PointerInt(612),
	//		ISBN:          util.PointerString("978-0-395-19395-8"),
	//		AuthorNames:   "Uniqu",
	//	},
	//}

	//for _, book := range books {
	//	b := services.CreateBook(&book) // returns book id
	//	util.Logger("%v", b)
	//}

	// New book definition
	//newbook := services.NewBook() // this collects all the data from the user
	// Book add
	//_ = services.CreateBook(&newbook) // returns book id

	// Get all books
	// services.GetBooks()

	// Delete book by book id
	//r := services.DeleteBook("20")
	//fmt.Println(r)

	//p, _ := services.GetProfileById("1")
	//fmt.Println(p)
	//
	//p2, _ := services.GetProfileByName("Adam")
	//fmt.Println(p2)
	//
	//p3, _ := services.GetProfileByName("AA")
	//fmt.Println(p3)

	//coll, err := services.GetCollection("2")
	//if err != nil {
	//	fmt.Println(err)
	//}
	//util.PrintStruct(coll)

	//b := services.GetBook("1")
	//util.PrintStruct(b)

	//pif := services.GetProfileItemFlags("1", "1")
	//util.PrintStruct(pif)

	//stats := services.GetStats("2")
	//util.PrintStruct(stats)

	ps := services.GetProfileSettings("2")
	util.PrintStruct(ps)
}
