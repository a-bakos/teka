package repository

import (
	"database/sql"
	"teka/constants"
	"teka/db"
	"teka/util"
)

// GetAuthor tries to find an author by name. Returns ID if found
func GetAuthor(tx *sql.Tx, name string) (int64, error) {
	util.Logger("Get by name: %s", name)
	var id int64
	err := tx.QueryRow(`SELECT id FROM creators WHERE name = ?`, name).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			util.Logger("Not found: %s (%s)", name, err)
			return constants.NotFoundCreatorId, err
		}
		util.Logger("Error: %s", err)
		return constants.NotFoundCreatorId, err
	}
	util.Logger("Author ID found: %d (%s)", id, name)
	return id, nil
}

// Todo: Streamline with CreateAuthors
func ProcessMultiAuthors(tx *sql.Tx, authors string) ([]int64, error) {
	var allAuthorIDs []int64
	util.Logger("Original value: %s", authors)
	for _, name := range util.SplitMultiAuthorString(authors) {
		if name == constants.EmptyString {
			continue // skip empty names
		}

		name = util.ProcessAuthorName(name)
		util.Logger("Processed author name: %s", name)

		id, _, err := getOrCreateAuthor(tx, name) // _ = wasCreated
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

	if err == sql.ErrNoRows && id == constants.NotFoundCreatorId {
		util.Logger("Author not found, creating new author entry: %s", name)
	} else if err != nil {
		util.Logger("GetAuthor failed for: %s, error: %v", name, err)
		return constants.NotFoundCreatorId, false, err
	} else if id != constants.NotFoundCreatorId && err == nil {
		util.Logger("Author already exists with ID: %s %d", name, id)
		return id, false, nil
	}

	newID, err := insertAuthor(tx, name)
	util.Logger("New creator inserted: ID / name : %d, %s", newID, name)
	if err != nil {
		return constants.NotFoundCreatorId, false, err
	}
	return newID, true, nil // new author created
}

// insertAuthor inserts a new author and returns the new ID
func insertAuthor(tx *sql.Tx, name string) (int64, error) {
	util.Logger("Started for: %s", name)
	res, err := tx.Exec(`INSERT INTO creators (name) VALUES (?)`, name)
	if err != nil {
		util.Logger("Failed for: %s", name)
		return constants.NotFoundCreatorId, err
	}

	creatorID, err := res.LastInsertId()
	util.Logger("Success, new author ID: %d (%s)", creatorID, name)
	if err != nil {
		util.Logger("Failure")
		return constants.DbFailedInsertId, err
	}

	return creatorID, nil
}

// CreateAuthors attempts to insert multiple authors from a string
func CreateAuthors(tx *sql.Tx, authors string) ([]int64, error) {
	util.Logger("Original authors value: %s", authors)

	var newIDs []int64
	for _, name := range util.SplitMultiAuthorString(authors) {
		if name == constants.EmptyString {
			continue // skip empty names
		}

		name = util.ProcessAuthorName(name)
		util.Logger("Processed author name: %s", name)

		id, wasCreated, err := getOrCreateAuthor(tx, name)
		if err != nil {
			return nil, err
		}
		if wasCreated {
			util.Logger("The inserted author ID: %d / %s", id, name)
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
