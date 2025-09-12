package models

// sketch

type QueryArgs struct {
	ItemId      *int
	ItemType    *string
	Title       *string
	Description *string
	Order       *string // "ASC" or "DESC"
}

type BookQueryArgs struct {
	QueryArgs
	Isbn      *string
	Publisher *string
}

// CreatorId
// ItemIdNotIn
