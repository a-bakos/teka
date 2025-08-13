# Téka - WIP

Book cataloging system for personal libraries

Planned features for v1 release:
- user profiles (very simple, no auth)
- crud operations for books
    - create: title, author, year, isbn, publisher, description, tags, 
      cover image, type (book, magazine, etc.)
    - read: book "profile" page
    - update: edit book details on profile page
    - delete: remove book from catalog
    - user-based book management: read/unread, favorite, reading list, user notes 
- browse books (list, favorites, reading list)
- search and sort by title, author, year, isbn, publisher, tags
- quick stats (total books, number read, number in reading list)
- add images for book covers
  - image compressor, thumbnail generation, resizing
- import/export to/from (csv, json)
- add book to reading list
- mark book as read/unread
- mark book as favorite
- in-app settings:
  - language selection
  - user profile management (username)
  - change user
  - backup/restore database in-app button
- multilingual support (english, hungarian)
- cross-platform gui
- starting with books only to limit scope but architecture needs to be flexible enough to support future catalogue-able items

Tech stack:
- Go
- SQLite
- Wails (for GUI)
- HTML + CSS / Tailwind + JS (for GUI)
- JSON

- previous considerations for gui: fyne, wails, gio
- previous considerations for internationalization dictionary: json, yaml, toml

---

### Models:

| Name               | Description                                                               |
|--------------------|---------------------------------------------------------------------------|
| `Item`             | Base model for all catalog items, contains common fields                  |
| `Book`             | Embedded in `Item`, represents a book with specific fields                |
| `Profile`          | User profile details                                                      |
| `ProfileSettings`  | User profile settings                                                     |
| `ProfileItemFlags` | Flags for user-specific item states (read, favorite, etc.)                |
| `Creator`          | Represents an author or creator of an item                                |
| `ItemCreator`      | Association between `Item` and `Creator` (to allow for multiple creators) |
| `Image`            | Represents an image associated with an item                               |

---

### Project Structure

- `main.go`: starts Wails, initializes App struct
- `cli/`: command line interface
- `app/app.go`: defines methods exposed to JS via Wails
- `services/`: contains higher-level logic (eg, book operations combining repo + extra rules)
- `repository/`: talks to SQLite, CRUD methods for tables
- `models/`: Go structs, app-specific data models
- `gui/`: HTML/CSS/JS that Wails serves; vanilla JS communicates with Go via Wails bindings
- `utils/`: helper functions

GUI layer never touches the DB directly

Services layer encapsulates app logic

Repository layer only handles SQL operations