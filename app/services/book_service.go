package services

import (
	"database/sql"
	"fmt"
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

func NewBook() models.Book {
	// validate inputs, sanitise, etc

	return models.Book{
		Item: models.Item{
			Title:       "Jamie Goes to Spain",
			Description: "Jamie Oliver's culinary journey through Egypt, exploring traditional recipes and cooking techniques.",
			ItemType:    constants.ItemTypeBook,
			CreatedBy:   1,
		},
		Publisher:     util.PointerString("Cooking Press"),
		PublishedDate: util.ParsePublishedDate("2025-05-11"),
		PageCount:     util.PointerInt(455),
		ISBN:          util.PointerString("978-3-16-148410-0"),
		AuthorNames:   "Jamie Oliver + Ainsley Harriott + Cook1 + Cook2 + Gok",
		// AuthorIDs:     []int64{}
	}
}

func CreateBook(b *models.Book) int64 {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.DbFailedInsertId
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	util.Logger("Book to add: %s by %s", b.Item.Title, b.AuthorNames)

	// Create or get authors [done]
	newAuthorIDs, err := repository.CreateAuthors(tx, b.AuthorNames)
	if err != nil {
		util.Logger("CreateAuthors error: %s", err)
		return constants.DbFailedInsertId
	}

	// Create or get item [done]
	bookID, err := repository.InsertItem(tx, b)
	if err != nil {
		util.Logger("Failed for book: %s, error: %s", b.Item.Title, err)
		return constants.DbFailedInsertId
	}

	var existingAuthorIDs []int64
	for _, name := range util.SplitMultiAuthorString(b.AuthorNames) {
		if name == constants.EmptyString {
			continue // skip empty names
		}
		name = util.ProcessAuthorName(name)

		authorID, err := repository.GetAuthor(tx, repository.GetAuthorByName, name)
		if err != nil {
			util.Logger("GetAuthorByName error: %s", err)
			return 0
		}
		// add to existingAuthorIDs if found
		if authorID != constants.NotFoundCreatorId {
			existingAuthorIDs = append(existingAuthorIDs, authorID)
		}
	}

	linkAuthorsToBook := func(tx *sql.Tx, bookID int64, authorIdCollection []int64) {
		for _, existingAuthorID := range existingAuthorIDs {
			_, err = repository.InsertItemCreator(tx, bookID, existingAuthorID, constants.RoleAuthor)
			if err != nil {
				util.Logger("InsertItemCreator error: %s", err)
			}
		}
	}

	linkAuthorsToBook(tx, bookID, existingAuthorIDs)
	linkAuthorsToBook(tx, bookID, newAuthorIDs)

	util.Logger("End for book ID: %d", bookID)
	return bookID
}

func GetBook(id string) models.Book {
	tx, err := db.Conn.Begin()
	if err != nil {
		return models.Book{}
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetBook(tx, id)
}

func UpdateBook() string {
	return "Update Book"
}

func DeleteBook(id string) bool {
	tx, err := db.Conn.Begin()
	if err != nil {
		return false
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	deleted, err := repository.DeleteBook(tx, id)
	if err != nil {
		util.Logger("Failed deleting book: %s (%v)", id, err)
		return false
	}
	if deleted == true {
		util.Logger("Book deleted successfully! %s", id)
		return true
	}

	return false
}

// todo
// filter: get books where
// creator id(s) and book id (to exclude current book)
// => more books from this author

func GetBooks() []models.Book {
	tx, err := db.Conn.Begin()
	if err != nil {
		return nil
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	util.Logger("All books query started")

	books := repository.GetBooks(tx)

	for _, book := range books {
		fmt.Printf("%+v\n\n", book)
	}
	return books
}

func GetBooksByProfileId(profileId string) []models.Book {
	tx, err := db.Conn.Begin()
	if err != nil {
		return nil
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()
	
	return repository.GetBooksByProfileId(tx, profileId)
}
