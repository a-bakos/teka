package util

import "time"

func PointerString(s string) *string {
	return &s
}

func PointerInt(i int) *int {
	return &i
}

func PointerTime(t time.Time) *time.Time {
	return &t
}
