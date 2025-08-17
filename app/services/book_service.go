package services

import (
	"fmt"
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

func CreateBook() models.Book {
	// validate inputs, sanitise, etc

	return models.Book{
		Item: models.Item{
			Title:       "Jamie Goes to Portugal",
			Description: "Jamie Oliver's culinary journey through Portugal, exploring traditional recipes and cooking techniques.",
			ItemType:    constants.ItemTypeBook,
			CreatedBy:   1,
		},
		Publisher:     util.PointerString("Cooking Press"),
		PublishedDate: util.ParsePublishedDate("2022-02-11"),
		PageCount:     util.PointerInt(455),
		ISBN:          util.PointerString("978-3-16-148410-0"),
		AuthorNames:   "Jamie Oliver + Gennaro Contaldo",
		// AuthorIDs:     []int64{}
	}
}

func AddBook(b *models.Book) (int64, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.DbFailedInsertId, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	fmt.Printf("Adding book started: %s\n", b.Item.Title)

	// Create or get authors [done]
	newAuthorIDs, err := repository.CreateAuthors(tx, b.AuthorNames)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// Create or get item [done]
	bookID, err := repository.InsertItem(tx, b)
	if err != nil {
		fmt.Printf("InsertItem failed for book: %s, error: %v\n", b.Item.Title, err)
		return constants.DbFailedInsertId, err
	}

	// Insert into item_creators and Link book and authors
	// But we also need to link existing authors to the book

	var existingAuthorIDs []int64
	// get author by name
	for _, name := range util.SplitMultiAuthorString(b.AuthorNames) {
		if name == constants.EmptyString {
			fmt.Printf("Empty string author skipped")
			continue // skip empty names
		}
		name = util.ProcessAuthorName(name)

		authorID, err := repository.GetAuthor(tx, name)
		if err != nil {
			return 0, err
		}
		// add to existingAuthorIDs if found
		if authorID != constants.NotFoundCreatorId {
			existingAuthorIDs = append(existingAuthorIDs, authorID)
		}
	}

	// Link existing authors to book
	for _, existingAuthorID := range existingAuthorIDs {
		_, err = repository.InsertItemCreator(tx, bookID, existingAuthorID, constants.RoleAuthor)
		if err != nil {
			return constants.DbFailedInsertId, err
		}
	}

	// Link book to new authors
	for _, newAuthorID := range newAuthorIDs {
		creatorID, err := repository.InsertItemCreator(tx, bookID, newAuthorID, constants.RoleAuthor)
		if creatorID == constants.DbFailedInsertId && err == nil {
			fmt.Println("Author already linked to book!")
			continue
		}
		if err != nil {
			return constants.DbFailedInsertId, err
		}
	}

	return bookID, nil
}

func GetBook() string {
	return "Get Book"
}

func UpdateBook() string {
	return "Update Book"
}

func DeleteBook() string {
	return "Delete Book"
}
