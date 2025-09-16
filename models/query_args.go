package models

import (
	"database/sql"
	"teka/constants"
	"teka/util"
)

// sketch

type QueryArgs struct {
	ItemId         *[]int // if empty, search all
	ItemIdNotIn    *[]int
	ItemType       *string
	Title          *string
	Description    *string
	Order          *string // "ASC" or "DESC"
	Limit          *int
	CreatorId      *[]int // id
	CreatorIdNotIn *[]int
}

type BookQueryArgs struct {
	QueryArgs
	Isbn      *string
	Publisher *[]string
	Author    *[]string // name
}

func querySketch(tx *sql.Tx, args BookQueryArgs) (*sql.Rows, error) {

	if args.Order == nil {
		args.Order = util.PointerString(constants.DbRowsOrderAsc)
	}

	_, _ = tx.Query(`
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
		    books.page_count
		ORDER BY
		    items.title ASC;
	`,
		constants.MultiAuthorSeparator,
	)

	return nil, nil
}
