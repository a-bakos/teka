package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"teka/constants"
	"teka/models"
	"teka/util"
)

type GetItemBy int

const (
	GetItemByTitle GetItemBy = iota
	GetItemById
)

type GetItemsBy int

const (
	GetItemsByType GetItemsBy = iota
	GetItemsByCreatedByID
)

func GetItem(tx *sql.Tx, by GetItemBy, value string) (int64, error) {
	switch by {
	case GetItemByTitle:
		return getItemByTitle(tx, value)
	case GetItemById:
		return getItemById(tx, value)
	default:
		return 0, nil // todo
	}
}

func getItemById(tx *sql.Tx, id string) (int64, error) {
	// todo
	return 0, nil
}

func getItemByTitle(tx *sql.Tx, title string) (int64, error) {
	util.Logger("Get by title: %s", title)
	var id int64
	title = strings.TrimSpace(title)
	err := tx.QueryRow(`SELECT id FROM items WHERE title = ?`, title).Scan(&id)
	if err == sql.ErrNoRows {
		util.Logger("Not found: %s (%s)", title, err)
		return constants.NotFoundItemId, err
	}
	if err != nil && err != sql.ErrNoRows {
		util.Logger("Error: %s", err)
		return constants.NotFoundItemId, err
	}
	return id, nil
}

func InsertItem(tx *sql.Tx, item *models.Book) (int64, error) {
	util.Logger("Started for: %s", item.Title)
	id, err := GetItem(tx, GetItemByTitle, item.Title)
	if err == sql.ErrNoRows && id == constants.NotFoundItemId {
		// Item does not exist, create a new one
		util.Logger("Item not found, creating new entry: %s", item.Title)
	} else if err != nil {
		util.Logger("GetItemByTitle failed for: %s, error: %v", item.Title, err)
		return constants.DbFailedInsertId, err
	} else if id != constants.NotFoundItemId && err == nil {
		// Item already exists
		util.Logger("Item already exists with ID: %d (%s)", id, item.Title)
		return id, nil
	}

	res, errInsert := tx.Exec(`
        INSERT INTO items (title, description, item_type, created_at, created_by)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
		item.Title, item.Description, item.ItemType, item.CreatedBy,
	)
	if errInsert != nil {
		util.Logger("Failed for: %s, error: %v", item.Title, errInsert)
		return constants.DbFailedInsertId, errInsert
	}

	itemID, errLastInsert := res.LastInsertId()
	util.Logger("Inserted item title / ID: %s / %d", item.Title, itemID)
	if errLastInsert != nil {
		return constants.DbFailedInsertId, errLastInsert
	}

	// Insert book [done]
	bookID, errInsertBook := InsertBook(tx, item, itemID)
	if bookID == constants.DbFailedInsertId && errInsertBook == nil {
		fmt.Println("book exists!")
		return 0, nil
	}

	if errInsertBook != nil {
		return constants.DbFailedInsertId, errInsertBook
	}

	return bookID, nil
}

func AddToFavs(tx *sql.Tx, bookId, profile string) bool {
	res, err := tx.Exec(`INSERT INTO profile_item_flags (profile_id, item_id, is_favourite) VALUES (?, ?, ?)`, profile, bookId, 1)
	if err != nil {
		util.Logger("Error inserting favorite item: %v", err)
		return false
	}
	var id int64
	id, errInsert := res.LastInsertId()
	if errInsert != nil {
		util.Logger("Error inserting favorite item: %v", errInsert)
		return false
	}
	util.Logger("Inserted favorite item: %d", id)
	return true
}

func RemoveFromFavs(tx *sql.Tx, bookId, profile string) bool {
	// Update row, don't delete
	res, err := tx.Exec(`UPDATE profile_item_flags SET is_favourite = 0 WHERE profile_id = ? AND item_id = ?`, profile, bookId)
	if err != nil {
		util.Logger("Error removing favorite item: %v", err)
		return false
	}
	rowsAffected, errRows := res.RowsAffected()
	if errRows != nil {
		util.Logger("Error removing favorite item: %v", errRows)
		return false
	}
	util.Logger("Removed favorite item, rows affected: %d", rowsAffected)
	return true
}

// todo
// getItemsByType
// getItemsByCreatedByID
