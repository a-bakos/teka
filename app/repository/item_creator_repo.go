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
	role = util.NormalizeRole(role) // move this to service

	res, err := tx.Exec(`INSERT INTO item_creators (item_id, creator_id, role) VALUES (?, ?, ?)`, itemID, creatorID, role)
	if err != nil {
		fmt.Println(err)
		return constants.DbFailedInsertId, err
	}

	itemCreatorID, err := res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	return itemCreatorID, nil
}
