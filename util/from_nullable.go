package util

import (
	"database/sql"
	"fmt"
)

func NullableToStringDisplay(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return "(null)"
}

func NullableToTimeDisplay(nt sql.NullTime) string {
	if nt.Valid {
		return nt.Time.Format("2006-01-02")
	}
	return "(null)"
}

func NullableToIntDisplay(ni sql.NullInt64) string {
	if ni.Valid {
		return fmt.Sprintf("%d", ni.Int64)
	}
	return "(null)"
}
