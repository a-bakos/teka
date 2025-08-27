package app

import (
	"fmt"
	"teka/app/services"
	"teka/constants"
	"teka/models"
	"teka/util"
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

	// Test books for bulk inserting
	books := []models.Book{
		{
			Item: models.Item{
				Title:       "Jamie Goes to Spain",
				Description: "Jamie Oliver's culinary journey through Spain, exploring traditional recipes and cooking techniques.",
				ItemType:    constants.ItemTypeBook,
				CreatedBy:   1,
			},
			Publisher:     util.PointerString("Cooking Press"),
			PublishedDate: util.ParsePublishedDate("2025-05-11"),
			PageCount:     util.PointerInt(455),
			ISBN:          util.PointerString("978-3-16-148410-0"),
			AuthorNames:   "Jamie Oliver + Ainsley Harriott + Cook1 + Cook2 + Gok",
		},
		{
			Item: models.Item{
				Title:       "The Lost Kingdom",
				Description: "An epic fantasy novel of forgotten realms, ancient magic, and the rise of a reluctant hero.",
				ItemType:    constants.ItemTypeBook,
				CreatedBy:   1,
			},
			Publisher:     util.PointerString("Mythic Tales"),
			PublishedDate: util.ParsePublishedDate("2023-09-21"),
			PageCount:     util.PointerInt(612),
			ISBN:          util.PointerString("978-0-395-19395-8"),
			AuthorNames:   "Eleanor Bright + R. J. Storm",
		},
		{
			Item: models.Item{
				Title:       "AI and Humanity",
				Description: "A thought-provoking analysis of artificial intelligence and its implications for human society.",
				ItemType:    constants.ItemTypeBook,
				CreatedBy:   1,
			},
			Publisher:     util.PointerString("FutureWorks"),
			PublishedDate: util.ParsePublishedDate("2024-03-05"),
			PageCount:     util.PointerInt(302),
			ISBN:          util.PointerString("978-1-4028-9462-6"),
			AuthorNames:   "Dr. L. Chan + Marcus Vale",
		},
		{
			Item: models.Item{
				Title:       "The Minimalist Gardener",
				Description: "Practical tips and inspiration for creating beautiful gardens with less effort and more joy.",
				ItemType:    constants.ItemTypeBook,
				CreatedBy:   1,
			},
			Publisher:     util.PointerString("Green Thumb Publishing"),
			PublishedDate: util.ParsePublishedDate("2022-07-14"),
			PageCount:     util.PointerInt(189),
			ISBN:          util.PointerString("978-0-14-044913-6"),
			AuthorNames:   "Sarah Bloom",
		},
		{
			Item: models.Item{
				Title:       "Cooking with Fire",
				Description: "Exploring the world’s oldest cooking method, from campfires to modern barbecue.",
				ItemType:    constants.ItemTypeBook,
				CreatedBy:   1,
			},
			Publisher:     util.PointerString("Culinary Arts House"),
			PublishedDate: util.ParsePublishedDate("2021-11-30"),
			PageCount:     util.PointerInt(367),
			ISBN:          util.PointerString("978-0-307-26293-8"),
			AuthorNames:   "Anthony Wild + Sam Brooks",
		},
	}

	for _, book := range books {
		_ = services.CreateBook(&book) // returns book id
	}

	// New book definition
	//newbook := services.NewBook() // this collects all the data from the user
	// Book add
	//_ = services.CreateBook(&newbook) // returns book id

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
