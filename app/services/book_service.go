package services

type bookService struct{}

var BookService = &bookService{}

func (s *bookService) AddBook() string {
	// validate inputs, sanitise, etc
	// create book model concrete type
	// call to repository layer to add book
	// repository.BookRepo.InsertBook()

	return "Add Book"
}

func (s *bookService) GetBook() string {
	return "Get Book"
}

func (s *bookService) UpdateBook() string {
	return "Update Book"
}

func (s *bookService) DeleteBook() string {
	return "Delete Book"
}
