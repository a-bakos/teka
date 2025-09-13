package models

type Stats struct {
	MyBooks int `json:"my_books_count"`
	MyFavs  int `json:"my_favs_count"`
	Reading int `json:"reading_count"`
	Read    int `json:"read_count"`
}

type LibStats struct {
	AllBooks   int64 `json:"all_books_count"`
	AllAuthors int64 `json:"all_authors_count"`
}
