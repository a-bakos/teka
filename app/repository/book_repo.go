package repository

import (
	"database/sql"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
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

func InsertBook(tx *sql.Tx, b *models.Book, itemID int64) (int64, error) {
	// Step 1: Process author(s)
	allAuthorIDs, err := ProcessMultiAuthors(tx, b.AuthorNames)
	if len(allAuthorIDs) == constants.ZeroValue || err != nil {
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
		util.Logger("InsertBook failed for item ID %d: %v", itemID, err)
		return constants.DbFailedInsertId, err
	}
	bookID, err := res.LastInsertId()
	if err != nil {
		util.Logger("InsertBook failed to get last insert ID for item ID %d: %v", itemID, err)
		return constants.DbFailedInsertId, err
	}

	return bookID, nil
}

//func InsertBookAutoTx(b *models.Book) (int64, error) {
//	var bookID int64
//	err := db.RunInTx(func(tx *sql.Tx) error {
//		var err error
//		bookID, err = InsertBook(tx, b)
//		return err
//	})
//	return bookID, err
//}
