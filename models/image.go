package models

type Image struct {
	ID        int
	ItemID    int
	FilePath  string
	Caption   *string
	SortOrder int
}
