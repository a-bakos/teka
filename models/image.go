package models

type Image struct {
	ID        int     `json:"id"`
	ItemID    int     `json:"item_id"`
	FilePath  string  `json:"file_path"`
	Caption   *string `json:"caption"`
	SortOrder int     `json:"sort_order"`
}
