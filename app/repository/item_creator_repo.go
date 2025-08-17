package repository

import (
	"database/sql"
	"fmt"
	"teka/constants"
	"teka/util"
)

func GetItemCreatorByCreatorID(tx *sql.Tx, creatorID int64) (int64, error) {
	var itemCreatorID int64
	err := tx.QueryRow(`SELECT id FROM item_creators WHERE creator_id = ?`, creatorID).Scan(&itemCreatorID)
	if err != nil {
		if err == sql.ErrNoRows {
			return constants.NotFoundCreatorId, nil // No item creator found
		}
		return constants.NotFoundCreatorId, err // Other error
	}
	return itemCreatorID, nil
}

func InsertItemCreator(tx *sql.Tx, itemID int64, creatorID int64, role string) (int64, error) {
	// Eventually move this to service. We're not allowing for custom roles yet.
	role = util.NormalizeRole(role)

	//  Check if the item_id to creator_id connection already exists
	var linkExists int
	err := tx.QueryRow(`SELECT EXISTS(SELECT 1 FROM item_creators WHERE item_id = ? AND creator_id = ?)`, itemID, creatorID).Scan(&linkExists)
	if err != nil {
		fmt.Println(err)
		return constants.DbFailedInsertId, err
	}
	if linkExists == constants.TrueInt {
		fmt.Printf("Link already exists for item_id: %d and creator_id: %d\n", itemID, creatorID)
		return constants.DbFailedInsertId, nil // Link already exists
	}

	res, err := tx.Exec(`INSERT INTO item_creators (item_id, creator_id, role) VALUES (?, ?, ?)`, itemID, creatorID, role)
	if err != nil {
		fmt.Println(err)
		return constants.DbFailedInsertId, err
	}

	itemCreatorID, err := res.LastInsertId()
	fmt.Printf("Created new link to book ID: %d with creator ID: %d\n", itemID, creatorID)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	return itemCreatorID, nil
}
