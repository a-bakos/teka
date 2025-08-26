package constants

const DbDriver string = "sqlite3"
const DbPath string = "./temp/tekatest.db"
const DbFailedInsertId int64 = 0

const ZeroValue int = 0
const NotFoundCreatorId int64 = 0
const NotFoundItemId int64 = 0

const FullLoggingEnabled bool = true

const ItemTypeBook string = "book"

const MultiAuthorSeparator string = "+"

const RoleAuthor string = "author"
const RoleUnknown string = "unknown"

const EmptyString string = ""

const SingleWhiteSpace string = " "

const TrueInt int = 1
const FalseInt int = 0

const ReferenceTimeLayout string = "2006-01-02"

const DbTableBooks string = "books"
const DbTableItems string = "items"
const DbTableCreators string = "creators"
const DbTableImages string = "images"
const DbTableProfiles string = "profiles"
const DbTableProfileSettings string = "profile_settings"
const DbTableItemCreators string = "item_creators"
const DbTableProfileItemFlags string = "profile_item_flags"
