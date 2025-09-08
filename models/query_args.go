package models

// sketch

type QueryArgs struct {
	ItemId      *int
	ItemType    *string
	Title       *string
	Description *string
}

type BookQueryArgs struct {
	QueryArgs
	Isbn      *string
	Publisher *string
}

// CreatorId
// ItemIdNotIn
