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

func CreateBook(b *models.Book) int64 {
	if db.Conn == nil {
		panic("DB connection is nil")
	}
	tx, err := db.Conn.Begin()
	if err != nil {
		util.Logger("%v", err)
		return constants.DbFailedInsertId
	}
	defer func() {
		if err != nil {
			util.Logger("%v", err)
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	util.Logger("Book to add: %s by %s", b.Item.Title, b.AuthorNames)

	// Create or get authors
	newAuthorIDs, errAuthors := repository.CreateAuthors(tx, b.AuthorNames)
	if errAuthors != nil {
		util.Logger("CreateAuthors error: %s", errAuthors)
		return constants.DbFailedInsertId
	}

	// Create or get item
	bookID, errInsert := repository.InsertItem(tx, b)
	if errInsert != nil {
		util.Logger("Failed for book: %s, error: %s", b.Item.Title, errInsert)
		return constants.DbFailedInsertId
	}

	var existingAuthorIDs []int64
	for _, name := range util.SplitMultiAuthorString(b.AuthorNames) {
		if name == constants.EmptyString {
			continue // skip empty names
		}
		name = util.ProcessAuthorName(name)

		authorID, errAuthor := repository.GetAuthor(tx, repository.GetAuthorByName, name)
		if errAuthor != nil {
			util.Logger("GetAuthorByName error: %s", errAuthor)
			return 0
		}
		if authorID != constants.NotFoundCreatorId {
			existingAuthorIDs = append(existingAuthorIDs, authorID)
		}
	}

	linkAuthorsToBook := func(tx *sql.Tx, bookID int64, authorIdCollection []int64) {
		for _, existingAuthorID := range existingAuthorIDs {
			_, errLink := repository.InsertItemCreator(tx, bookID, existingAuthorID, constants.RoleAuthor)
			if errLink != nil {
				util.Logger("InsertItemCreator error: %s", errLink)
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

func GetLibraryStats() (models.LibStats, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return models.LibStats{}, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	stats, statsErr := repository.GetLibraryStats(tx)
	if statsErr != nil {
		return models.LibStats{}, statsErr
	}

	return stats, nil
}

// todo
func GetAuthorsList() []models.Author {
	return []models.Author{}
}

// todo
func GetPublishersList() []models.Publisher {
	return []models.Publisher{}
}
