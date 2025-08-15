package repository

import (
	"teka/constants"
	"teka/db"
	"teka/models"
)

// InsertBook Implementation for inserting a book
// insert book into items AND books tables
// insert author into authors table
// insert item_creators and link book and authors
func InsertBook(b *models.Book) (int64, error) {
	/// Why a transaction?
	// If the items insert succeeds but the books insert fails, we don't want an orphaned row in items.
	// The tx ensures both succeed or both fail.
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

	// Step 1: Insert into items
	res, err := tx.Exec(`
        INSERT INTO items (title, description, item_type, created_at, created_by)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
		b.Title, b.Description, constants.ItemTypeBook, b.CreatedBy,
	)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	itemID, err := res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// Step 2: Insert into books
	_, err = tx.Exec(`
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

	return itemID, nil
}
