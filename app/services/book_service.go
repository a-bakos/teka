package services

import (
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

func NewBook() models.Book {
	// validate inputs, sanitise, etc

	return models.Book{
		Item: models.Item{
			Title:       "Jamie Goes to Morocco",
			Description: "Jamie Oliver's culinary journey through Morocco, exploring traditional recipes and cooking techniques.",
			ItemType:    constants.ItemTypeBook,
			CreatedBy:   1,
		},
		Publisher:     util.PointerString("Cooking Press"),
		PublishedDate: util.ParsePublishedDate("2025-05-11"),
		PageCount:     util.PointerInt(455),
		ISBN:          util.PointerString("978-3-16-148410-0"),
		AuthorNames:   "Jamie Oliver + Ainsley Harriott",
		// AuthorIDs:     []int64{}
	}
}

func CreateBook(b *models.Book) (int64, error) {
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

	util.Logger("Book to add: %s by %s", b.Item.Title, b.AuthorNames)

	// Create or get authors [done]
	newAuthorIDs, err := repository.CreateAuthors(tx, b.AuthorNames)
	if err != nil {
		return constants.DbFailedInsertId, err
	}

	// Create or get item [done]
	bookID, err := repository.InsertItem(tx, b)
	if err != nil {
		util.Logger("Failed for book: %s, error: %s", b.Item.Title, err)
		return constants.DbFailedInsertId, err
	}

	var existingAuthorIDs []int64
	for _, name := range util.SplitMultiAuthorString(b.AuthorNames) {
		if name == constants.EmptyString {
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
		_, err := repository.InsertItemCreator(tx, bookID, newAuthorID, constants.RoleAuthor)
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
