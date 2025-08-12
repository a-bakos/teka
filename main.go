package main

import (
	"fmt"
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
}
