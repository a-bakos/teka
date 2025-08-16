package repository

import (
	"database/sql"
	"fmt"
	"teka/constants"
	"teka/db"
	"teka/models"
)

func GetBookByTitleAutoTx(title string) (int64, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.NotFoundCreatorId, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return GetItemByTitle(tx, title)
}

// InsertBook Implementation for inserting a book
// insert book into items AND books tables
// insert author into authors table
// insert item_creators and link book and authors
func InsertBook(tx *sql.Tx, b *models.Book) (int64, error) {
	// Step 1: Process author(s)
	allAuthorIDs, err := ProcessMultiAuthors(tx, b.AuthorNames)
	if len(allAuthorIDs) == constants.ZeroValue || err != nil {
		return constants.DbFailedInsertId, err
	}
	// Step 2: Insert into items
	itemID, err := InsertItem(tx, &b.Item)
	if itemID != constants.NotFoundItemId { // not zero ie we have ID
		fmt.Println("book already exists")
		return constants.DbFailedInsertId, nil
	}
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// Step 2: Insert into books
	res, err := tx.Exec(`
        INSERT INTO books (item_id, publisher, published_date, page_count, isbn)
        VALUES (?, ?, ?, ?, ?)`,
		itemID,
		NullString(b.Publisher),
		NullTime(b.PublishedDate),
		NullInt(b.PageCount),
		NullString(b.ISBN),
	)
	if err != nil {
		return constants.DbFailedInsertId, err
	}
	bookID, err := res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	return bookID, nil
}

func InsertBookAutoTx(b *models.Book) (int64, error) {
	var bookID int64
	err := db.RunInTx(func(tx *sql.Tx) error {
		var err error
		bookID, err = InsertBook(tx, b)
		return err
	})
	return bookID, err
}
