package repository

import (
	"database/sql"
	"teka/constants"
	"teka/util"
)

type GetItemCreatorBy int

const (
	GetItemCreatorByCreatorId GetItemCreatorBy = iota
	GetItemCreatorByRole
)

func GetItemCreator(tx *sql.Tx, by GetItemCreatorBy, value string) (int64, error) {
	switch by {
	case GetItemCreatorByCreatorId:
		creatorID, err := util.StringToInt64(value)
		if err != nil {
			util.Logger("Error converting creator ID: %s", err)
			return constants.NotFoundCreatorId, err
		}
		return getItemCreatorByCreatorID(tx, creatorID)
	case GetItemCreatorByRole:
		return getItemCreatorByRole(tx, value)
	default:
		return 0, nil // todo
	}
}

func getItemCreatorByRole(tx *sql.Tx, role string) (int64, error) {
	// todo
	return 0, nil
}

func getItemCreatorByCreatorID(tx *sql.Tx, creatorID int64) (int64, error) {
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
	// TODO Eventually move this to service, but we're not allowing for custom roles yet
	role = util.NormalizeRole(role)

	//  Check if the item_id to creator_id connection already exists
	var linkExists int
	err := tx.QueryRow(`SELECT EXISTS(SELECT 1 FROM item_creators WHERE item_id = ? AND creator_id = ?)`, itemID, creatorID).Scan(&linkExists)
	if err != nil {
		util.Logger("Error (QueryRow): %s", err)
		return constants.DbFailedInsertId, err
	}
	if linkExists == constants.TrueInt {
		util.Logger("Link already exists between item_id %d and creator_id %d", itemID, creatorID)
		return constants.DbFailedInsertId, nil
	}

	res, err := tx.Exec(`INSERT INTO item_creators (item_id, creator_id, role) VALUES (?, ?, ?)`, itemID, creatorID, role)
	if err != nil {
		util.Logger("Error (Exec): %s", err)
		return constants.DbFailedInsertId, err
	}

	itemCreatorID, err := res.LastInsertId()
	util.Logger("Created new link to book ID %d with creator ID %d", itemID, creatorID)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	return itemCreatorID, nil
}
