package services

import (
	"fmt"
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
	"time"
)

func CreateBook() models.Book {
	// validate inputs, sanitise, etc

	// Deal with published date
	parsedPublished, err := time.Parse(time.RFC3339, "2020-01-01T00:00:00Z")
	var published *time.Time
	if err == nil {
		published = util.PointerTime(parsedPublished)
	} else {
		published = nil
	}

	return models.Book{
		Item: models.Item{
			Title:       "New Book 3",
			Description: "A new book description",
			ItemType:    constants.ItemTypeBook,
			CreatedBy:   1,
		},
		Publisher:     util.PointerString("Sample Publisher"),
		PublishedDate: published,
		PageCount:     util.PointerInt(300),
		ISBN:          util.PointerString("978-3-16-148410-0"),
		AuthorNames:   "John Doe + Jane Smith",
		// AuthorIDs:     []int64{}
	}
}

func AddBook(b *models.Book) (int64, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.DbFailedInsertId, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	// Create or get authors
	newAuthorIDs, err := repository.CreateAuthors(tx, b.AuthorNames)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// Create or get item
	_, err = repository.InsertItem(tx, &b.Item)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// Insert book
	bookID, err := repository.InsertBook(tx, b)
	if bookID == constants.DbFailedInsertId && err == nil {
		fmt.Println("book exists!")
		return 0, nil
	}

	if err != nil {
		fmt.Println("are we here")
		return constants.DbFailedInsertId, err
	}

	// Insert into item_creators and Link book and authors
	for _, authorID := range newAuthorIDs {
		_, err = repository.InsertItemCreator(tx, bookID, authorID, constants.RoleAuthor)
		if err != nil {
			return constants.DbFailedInsertId, err
		}
	}

	return bookID, nil
}

func GetBook() string {
	return "Get Book"
}

func UpdateBook() string {
	return "Update Book"
}

func DeleteBook() string {
	return "Delete Book"
}
