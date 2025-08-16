package repository

import (
	"database/sql"
	"strings"
	"teka/constants"
	"teka/models"
)

func GetItemByTitle(tx *sql.Tx, title string) (int64, error) {
	var id int64
	title = strings.TrimSpace(title)
	err := tx.QueryRow(`SELECT id FROM items WHERE title = ?`, title).Scan(&id)
	if err != nil {
		// to debug: if err == sql.ErrNoRows
		return constants.NotFoundItemId, err
	}
	return id, nil
}

func InsertItem(tx *sql.Tx, item *models.Item) (int64, error) {
	res, err := tx.Exec(`
        INSERT INTO items (title, description, item_type, created_at, created_by)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
		item.Title, item.Description, item.ItemType, item.CreatedBy,
	)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	itemID, err := res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	return itemID, nil
}

// todo
// getItemsByType
