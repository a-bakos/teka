package repository

import (
	"database/sql"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

type GetBookBy int

const (
	GetBookByName GetBookBy = iota
	GetBookByBookId
	GetBookByItemId
)

func GetBookByTitleAutoTx(title string) (int64, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.NotFoundCreatorId, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return GetItem(tx, GetItemByTitle, title)
}

func InsertBook(tx *sql.Tx, b *models.Book, itemID int64) (int64, error) {
	// Step 1: Process author(s)
	allAuthorIDs, err := ProcessMultiAuthors(tx, b.AuthorNames)
	if len(allAuthorIDs) == constants.ZeroValue || err != nil {
		return constants.DbFailedInsertId, err
	}

	// Step 2: Insert into books
	res, err := tx.Exec(`
        INSERT INTO books (item_id, publisher, published_date, page_count, isbn)
        VALUES (?, ?, ?, ?, ?)`,
		itemID,
		NullString(b.Publisher),
		NullTime(b.PublishedDate),
		NullInt(b.PageCount),
		NullString(b.ISBN),
	)
	if err != nil {
		util.Logger("InsertBook failed for item ID %d: %v", itemID, err)
		return constants.DbFailedInsertId, err
	}
	bookID, err := res.LastInsertId()
	if err != nil {
		util.Logger("InsertBook failed to get last insert ID for item ID %d: %v", itemID, err)
		return constants.DbFailedInsertId, err
	}

	return bookID, nil
}

//func InsertBookAutoTx(b *models.Book) (int64, error) {
//	var bookID int64
//	err := db.RunInTx(func(tx *sql.Tx) error {
//		var err error
//		bookID, err = InsertBook(tx, b)
//		return err
//	})
//	return bookID, err
//}

// Query filter idea
type QueryArgs struct {
	ItemTitle         *string
	ItemType          *string
	ItemIdIn          *[]int // maybe different
	ItemCreatedAt     *string
	ItemUpdatedAt     *string
	ItemCreatedBy     *int
	ItemUpdatedBy     *int
	BookISBN          *string
	BookPublisher     *string
	BookPublishedDate *string
	BookPageCount     *int
}

func DeleteBook(tx *sql.Tx, id string) (bool, error) {
	// To properly delete a book, all 4 deletion needs to complete
	deletes := []struct {
		table  string
		column string
	}{
		{constants.DbTableBooks, "item_id"},
		{constants.DbTableItems, "id"},
		{constants.DbTableItemCreators, "item_id"},
		{constants.DbTableProfileItemFlags, "item_id"},
	}

	for _, d := range deletes {
		ok, err := deleteFromTable(tx, d.table, d.column, id)
		if err != nil {
			return false, err
		}
		if !ok {
			util.Logger("Warning: nothing deleted from %s for %s", d.table, id)
		}
	}

	return true, nil // todo handle when row doesn't exist and no error
}

func GetBook(tx *sql.Tx, id string) models.Book {
	var b models.Book
	err := tx.QueryRow(`
		SELECT 
		    items.id,
		    items.title,
		    items.description, 
		    items.item_type,
		    items.created_at,
		    items.updated_at,
		    items.created_by,
		    items.updated_by,   
		    books.isbn,
		    books.publisher,
		    books.published_date, 
		    books.page_count,
		    GROUP_CONCAT(creators.name, ?) AS author_names -- group for multi-authors = author1+author2
		FROM items 
		INNER JOIN books 
			ON items.id = books.item_id
		INNER JOIN item_creators
			ON items.id = item_creators.item_id
		INNER JOIN creators
			ON item_creators.creator_id = creators.id
		WHERE books.item_id = ?
		GROUP BY
		    items.id,
		    items.title,
		    items.description, 
		    items.item_type,
		    items.created_at,
		    items.updated_at,
		    items.created_by,
		    items.updated_by,
		    books.isbn,
		    books.publisher, 
		    books.published_date, 
		    books.page_count;
		`,
		constants.MultiAuthorSeparator,
		id,
	).Scan(
		&b.ID,
		&b.Title,
		&b.Description,
		&b.ItemType,
		&b.CreatedAt,
		&b.UpdatedAt,
		&b.CreatedBy,
		&b.UpdatedBy,
		&b.ISBN,
		&b.Publisher,
		&b.PublishedDate,
		&b.PageCount,
		&b.AuthorNames,
	)

	if err != nil {
		util.Logger("Failed: %v", err)
		return models.Book{}
	}

	return b
}

// todo booksfilter will be added
func GetBooks(tx *sql.Tx) []models.Book {
	booksRows, err := tx.Query(`
		SELECT 
		    items.id,
		    items.title,
		    items.description, 
		    items.item_type,
		    items.created_at,
		    items.updated_at,
		    items.created_by,
		    items.updated_by,   
		    books.isbn,
		    books.publisher,
		    books.published_date, 
		    books.page_count,
		    GROUP_CONCAT(creators.name, ?) AS author_names -- group for multi-authors = author1+author2
		FROM items 
		INNER JOIN books 
			ON items.id = books.item_id
		INNER JOIN item_creators
			ON items.id = item_creators.item_id
		INNER JOIN creators
			ON item_creators.creator_id = creators.id
		GROUP BY
		    items.id,
		    items.title,
		    items.description, 
		    items.item_type,
		    items.created_at,
		    items.updated_at,
		    items.created_by,
		    items.updated_by,
		    books.isbn,
		    books.publisher, 
		    books.published_date, 
		    books.page_count;
	`,
		constants.MultiAuthorSeparator,
	)

	if err != nil {
		util.Logger("Failed: %v", err)
	}

	var books []models.Book // container
	for booksRows.Next() {
		var b models.Book

		err = booksRows.Scan(
			&b.Item.ID,
			&b.Item.Title,
			&b.Item.Description,
			&b.Item.ItemType,
			&b.Item.CreatedAt,
			&b.Item.UpdatedAt,
			&b.Item.CreatedBy,
			&b.Item.UpdatedBy,
			&b.ISBN,
			&b.Publisher,
			&b.PublishedDate,
			&b.PageCount,
			&b.AuthorNames,
		)
		if err != nil {
			util.Logger("Failed for item ID %d: %v", b.Item.ID, err)
		}

		books = append(books, b)
	}

	return books
}

func GetBooksByProfileId(tx *sql.Tx, profileId string) []models.Book {
	booksRows, err := tx.Query(`
		SELECT 
		    items.id,
		    items.title,
		    items.description, 
		    items.item_type,
		    items.created_at,
		    items.updated_at,
		    items.created_by,
		    items.updated_by,   
		    books.isbn,
		    books.publisher,
		    books.published_date, 
		    books.page_count,
		    GROUP_CONCAT(creators.name, ?) AS author_names -- group for multi-authors = author1+author2
		FROM items 
		INNER JOIN books 
			ON items.id = books.item_id
		INNER JOIN item_creators
			ON items.id = item_creators.item_id
		INNER JOIN creators
			ON item_creators.creator_id = creators.id
		INNER JOIN collections
			ON collections.item_id = items.id 
		WHERE
		    collections.profile_id = ?
		GROUP BY
		    items.id,
		    items.title,
		    items.description, 
		    items.item_type,
		    items.created_at,
		    items.updated_at,
		    items.created_by,
		    items.updated_by,
		    books.isbn,
		    books.publisher, 
		    books.published_date, 
		    books.page_count;
	`,
		constants.MultiAuthorSeparator,
		profileId,
	)

	if err != nil {
		util.Logger("Failed: %v", err)
	}
	var books []models.Book // container
	for booksRows.Next() {
		var b models.Book

		err = booksRows.Scan(
			&b.Item.ID,
			&b.Item.Title,
			&b.Item.Description,
			&b.Item.ItemType,
			&b.Item.CreatedAt,
			&b.Item.UpdatedAt,
			&b.Item.CreatedBy,
			&b.Item.UpdatedBy,
			&b.ISBN,
			&b.Publisher,
			&b.PublishedDate,
			&b.PageCount,
			&b.AuthorNames,
		)
		if err != nil {
			util.Logger("Failed for item ID %d: %v", b.Item.ID, err)
		}

		books = append(books, b)
	}

	return books
}
