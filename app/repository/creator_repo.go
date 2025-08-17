package repository

import (
	"database/sql"
	"fmt"
	"teka/constants"
	"teka/db"
	"teka/util"
)

// GetAuthor tries to find an author by name. Returns ID if found
func GetAuthor(tx *sql.Tx, name string) (int64, error) {
	fmt.Printf("Getting author by name: %s\n", name)
	var id int64
	err := tx.QueryRow(`SELECT id FROM creators WHERE name = ?`, name).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("(sql.ErrNoRows) Author not found: %s\n", name)
			return constants.NotFoundCreatorId, err // author not found
		}
		fmt.Printf("GetAuthor - other error")
		return constants.NotFoundCreatorId, err
	}
	fmt.Printf("GetAuthor returned ID: %d\n", id)
	return id, nil
}

// Todo: Streamline with CreateAuthors
func ProcessMultiAuthors(tx *sql.Tx, authors string) ([]int64, error) {
	var allAuthorIDs []int64
	for _, name := range util.SplitMultiAuthorString(authors) {
		if name == constants.EmptyString {
			fmt.Printf("Empty string author skipped")
			continue // skip empty names
		}

		name = util.ProcessAuthorName(name)
		fmt.Printf("The processed author name: %s\n", name)

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
	fmt.Printf("getOrCreateAuthor\n")
	id, err := GetAuthor(tx, name)

	if err == sql.ErrNoRows && id == constants.NotFoundCreatorId {
		fmt.Printf("Author not found, creating new author: %s\n", name)
	} else if err != nil {
		fmt.Printf("GetAuthor failed for: %s, error: %v\n", name, err)
		return constants.NotFoundCreatorId, false, err
	} else if id != constants.NotFoundCreatorId && err == nil {
		fmt.Printf("Author already exists with ID: %d\n", id)
		return id, false, nil
	}

	newID, err := insertAuthor(tx, name)
	fmt.Printf("getOrCreateAuthor - new creator inserted: ID / name : %d, %s\n", newID, name)
	if err != nil {
		return constants.NotFoundCreatorId, false, err
	}
	return newID, true, nil // new author created
}

// insertAuthor inserts a new author and returns the new ID
func insertAuthor(tx *sql.Tx, name string) (int64, error) {
	fmt.Printf("insertAuthor started: %s\n", name)
	res, err := tx.Exec(`INSERT INTO creators (name) VALUES (?)`, name)
	if err != nil {
		fmt.Printf("insertAuthor failed for: %s\n", name)
		return constants.NotFoundCreatorId, err
	}

	creatorID, err := res.LastInsertId()
	fmt.Printf("insertAuthor success, ID: %d\n", creatorID)
	if err != nil {
		fmt.Printf("insertAuthor failure")
		return constants.DbFailedInsertId, err
	}

	return creatorID, nil
}

// CreateAuthors attempts to insert multiple authors from a string
func CreateAuthors(tx *sql.Tx, authors string) ([]int64, error) {

	fmt.Printf("Adding author(s) (original value): %s\n", authors)

	var newIDs []int64
	for _, name := range util.SplitMultiAuthorString(authors) {
		if name == constants.EmptyString {
			fmt.Printf("Empty string author skipped")
			continue // skip empty names
		}

		name = util.ProcessAuthorName(name)
		fmt.Printf("The processed author name: %s\n", name)

		id, wasCreated, err := getOrCreateAuthor(tx, name)
		if err != nil {
			return nil, err
		}
		if wasCreated {
			fmt.Printf("The inserted author ID: %d\n", id)
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
