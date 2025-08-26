package repository

import (
	"database/sql"
	"fmt"
	"teka/util"
)

func deleteFromTable(tx *sql.Tx, table string, column string, value string) (bool, error) {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ?", table, column)

	res, err := tx.Exec(query, value)
	if err != nil {
		util.Logger("Error deleting from %s: %s (%v)", table, value, err)
		return false, err
	}

	r, rowsErr := res.RowsAffected()
	if rowsErr != nil {
		util.Logger("Error getting affected rows from %s: %v", table, rowsErr)
		return false, rowsErr
	}

	if r > 0 {
		util.Logger("Deleted from %s: %s", table, value)
		return true, nil
	} else {
		util.Logger("%s entry doesn't exist: %s", table, value)
		return false, nil
	}
}
