package models

type Stats struct {
	MyBooks int `json:"my_books_count"`
	MyFavs  int `json:"my_favs_count"`
	Reading int `json:"reading_count"`
	Read    int `json:"read_count"`
}
