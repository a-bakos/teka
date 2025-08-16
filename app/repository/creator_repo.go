package repository

import (
	"database/sql"
	"strings"
	"teka/constants"
	"teka/db"
	"teka/util"
)

// GetAuthor tries to find an author by name. Returns ID if found
func GetAuthor(tx *sql.Tx, name string) (int64, error) {
	var id int64
	err := tx.QueryRow(`SELECT id FROM creators WHERE name = ?`, name).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			return constants.NotFoundCreatorId, nil // not found
		}
		return constants.NotFoundCreatorId, err
	}
	return id, nil
}

func ProcessMultiAuthors(tx *sql.Tx, authors string) ([]int64, error) {
	var allAuthorIDs []int64
	for _, name := range util.SplitMultiAuthorString(authors) {
		name = strings.TrimSpace(name)
		if name == constants.EmptyString {
			continue
		}
		id, _, err := getOrCreateAuthor(tx, name)
		if err != nil {
			return nil, err
		}
		allAuthorIDs = append(allAuthorIDs, id)
	}
	return allAuthorIDs, nil
}

// getOrCreateAuthor attempts to find an author by name and creates it if not found
// returns: authorID, wasCreated, err
func getOrCreateAuthor(tx *sql.Tx, name string) (int64, bool, error) {
	id, err := GetAuthor(tx, name)
	if err != nil {
		return constants.NotFoundCreatorId, false, err
	}
	if id != constants.NotFoundCreatorId {
		return id, false, nil
	}
	newID, err := insertAuthor(tx, name)
	if err != nil {
		return constants.NotFoundCreatorId, false, err
	}
	return newID, true, nil // new author created
}

// insertAuthor inserts a new author and returns the new ID
func insertAuthor(tx *sql.Tx, name string) (int64, error) {
	res, err := tx.Exec(`INSERT INTO creators (name) VALUES (?)`, name)
	if err != nil {
		return constants.NotFoundCreatorId, err
	}

	authorID, err := res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// insert int item_creators
	_, err = InsertItemCreator(tx, authorID, constants.RoleAuthor)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	return authorID, nil
}

// func LinkAuthorsToItem(tx, itemID, allAuthorIDs) {}

// CreateAuthors attempts to insert multiple authors from a string
func CreateAuthors(tx *sql.Tx, authors string) ([]int64, error) {
	names := strings.Split(authors, constants.MultiAuthorSeparator)
	var newIDs []int64

	for _, name := range names {
		name = strings.TrimSpace(name)
		if name == constants.EmptyString {
			continue // skip empty names
		}
		id, wasCreated, err := getOrCreateAuthor(tx, name)
		if err != nil {
			return nil, err
		}
		if wasCreated {
			newIDs = append(newIDs, id)
		}
	}
	return newIDs, nil
}

func GetAuthorByNameAutoTx(name string) (int64, error) {
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

	return GetAuthor(tx, name)
}

func AddAuthorAutoTx(name string) (int64, error) {
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

	return insertAuthor(tx, name)
}

func LinkAuthorsToItem(tx *sql.Tx, itemID int64, authorIDs []int64) error {
	for _, authorID := range authorIDs {
		_, err := tx.Exec(`
			INSERT INTO item_creators (item_id, creator_id, role)
			VALUES (?, ?, ?)`,
			itemID, authorID, constants.RoleAuthor,
		)
		if err != nil {
			return err
		}
	}
	return nil
}
