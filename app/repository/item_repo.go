package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"teka/constants"
	"teka/models"
)

func GetItemByTitle(tx *sql.Tx, title string) (int64, error) {
	fmt.Printf("Getting item by title: %s\n", title)
	var id int64
	title = strings.TrimSpace(title)
	err := tx.QueryRow(`SELECT id FROM items WHERE title = ?`, title).Scan(&id)
	if err == sql.ErrNoRows {
		fmt.Printf("Getting item by title - item not found: %s\n", title)
		return constants.NotFoundItemId, err
	}

	///
	if err != nil && err != sql.ErrNoRows {
		return constants.NotFoundItemId, err
	}
	return id, nil
}

func InsertItem(tx *sql.Tx, item *models.Book) (int64, error) {
	fmt.Printf("Inserting item started for: %s\n", item.Title)
	id, err := GetItemByTitle(tx, item.Title)
	if err == sql.ErrNoRows && id == constants.NotFoundItemId {
		fmt.Printf("Item not found, creating new item: %s\n", item.Title)
	} else if err != nil {
		fmt.Printf("GetItemByTitle failed for: %s, error: %v\n", item.Title, err)
		return constants.DbFailedInsertId, err
	} else if id != constants.NotFoundItemId && err == nil {
		fmt.Println(err)
		fmt.Printf("Item already exists with ID: %d\n", id)
		return id, nil // item already exists
	}

	res, err := tx.Exec(`
        INSERT INTO items (title, description, item_type, created_at, created_by)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
		item.Title, item.Description, item.ItemType, item.CreatedBy,
	)
	if err != nil {
		fmt.Printf("InsertItem failed for: %s, error: %v\n", item.Title, err)
		return constants.DbFailedInsertId, err
	}

	itemID, err := res.LastInsertId()
	fmt.Printf("Inserted item title/ID: %s/%d\n\n", item.Title, itemID)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// we can only run InsertBook if InsertItem ID does not exist

	// Insert book [done]
	bookID, err := InsertBook(tx, item, itemID)
	if bookID == constants.DbFailedInsertId && err == nil {
		fmt.Println("book exists!")
		return 0, nil
	}

	if err != nil {
		fmt.Println("are we here")
		return constants.DbFailedInsertId, err
	}

	return bookID, nil
}

// todo
// getItemsByType
