package services

import (
	"fmt"
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
	"time"
)

func CreateBook() models.Book {
	// validate inputs, sanitise, etc

	// Deal with published date
	parsedPublished, err := time.Parse(time.RFC3339, "2021-01-01T00:00:00Z")
	var published *time.Time
	if err == nil {
		published = util.PointerTime(parsedPublished)
	} else {
		published = nil
	}

	return models.Book{
		Item: models.Item{
			Title:       "Jamie Goes to Italy",
			Description: "Jamie Oliver's culinary journey through Italy, exploring traditional recipes and cooking techniques.",
			ItemType:    constants.ItemTypeBook,
			CreatedBy:   1,
		},
		Publisher:     util.PointerString("Cooking Press"),
		PublishedDate: published,
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
	// todo but only do this if they are not already linked!!
	for _, existingAuthorID := range existingAuthorIDs {
		_, err = repository.InsertItemCreator(tx, bookID, existingAuthorID, constants.RoleAuthor)
		if err != nil {
			return constants.DbFailedInsertId, err
		}
	}

	// Link book to new authors
	for _, newAuthorID := range newAuthorIDs {
		_, err = repository.InsertItemCreator(tx, bookID, newAuthorID, constants.RoleAuthor)
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
