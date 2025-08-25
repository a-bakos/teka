package db

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"teka/constants"
)

var Conn *sql.DB

func Init(filepath string) error {
	var err error
	Conn, err = sql.Open(constants.DbDriver, filepath)
	if err != nil {
		return err
	}
	return Conn.Ping()
}

// RunInTx is a generic transaction runner
// Why a transaction?
// Eg. If the items insert succeeds but the books insert fails, we don't want an orphaned row in items.
// The tx ensures both succeed or both fail.
func RunInTx(fn func(tx *sql.Tx) error) error {
	tx, err := Conn.Begin()
	if err != nil {
		return err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return fn(tx)
}
