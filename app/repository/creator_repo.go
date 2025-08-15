package repository

import (
	"database/sql"
	"strings"
	"teka/constants"
	"teka/db"
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

// GetOrCreateAuthor attempts to find an author by name and creates it if not found
// returns: authorID, wasCreated, err
func GetOrCreateAuthor(tx *sql.Tx, name string) (int64, bool, error) {
	id, err := GetAuthor(tx, name)
	if err != nil {
		return constants.NotFoundCreatorId, false, err
	}
	if id != constants.NotFoundCreatorId {
		return id, false, nil
	}
	newID, err := InsertAuthor(tx, name)
	if err != nil {
		return constants.NotFoundCreatorId, false, err
	}
	return newID, true, nil // new author created
}

// InsertAuthor inserts a new author and returns the new ID
func InsertAuthor(tx *sql.Tx, name string) (int64, error) {
	res, err := tx.Exec(`INSERT INTO creators (name) VALUES (?)`, name)
	if err != nil {
		return constants.NotFoundCreatorId, err
	}

	authorID, err := res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// insert int item_creators
	_, err = tx.Exec(`
        INSERT INTO item_creators (creator_id, role)
        VALUES (?, ?)`,
		authorID, constants.RoleAuthor,
	)
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
		id, wasCreated, err := GetOrCreateAuthor(tx, name)
		if err != nil {
			return nil, err
		}
		if wasCreated {
			newIDs = append(newIDs, id)
		}
	}
	return newIDs, nil
}

func GetAuthorByName(name string) (int64, error) {
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

func AddAuthor(name string) (int64, error) {
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

	return InsertAuthor(tx, name)
}
