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

Services layer encapsulates app/business logic

Repository, database access layer, only handles SQL operations, doesn't contain business logic. It only knows how to fetch, store, and update data.

Using a package-level singleton instances

## Project Layer Responsibilities

1. Models (/models)
   Purpose: Define the data structures that represent your entities (Books, Profiles, Images, etc.).

What goes here:

- Struct definitions (Book, Profile, ProfileItemFlags, etc.)
- Field tags (e.g., JSON, DB column mappings)
- Possibly constants/enums (e.g., ReadingStatus)
- Optional helper methods directly tied to the struct (e.g., func (b Book) FullTitle() string).

What doesn’t go here:

- No SQL queries.
- No business rules.
- No service orchestration.

2. Repositories (/repository)
   Purpose: Handle all low-level database interactions.

What goes here:

- CRUD operations for a specific model.
- SQL queries and statement execution.
- Converting DB rows into model structs and vice versa.

What doesn’t go here:

- No data validation rules.
- No decision-making logic (eg, "only insert if profile exists").
- No multi-entity orchestration.

3. Services (/services)
   Purpose: Contain the business logic and orchestration of operations.

What goes here:

- Input validation.
- Calling the appropriate repository functions.
- Combining results from multiple repositories.
- Higher-level operations (e.g., "Mark book as read for profile X").

What doesn’t go here:

- No raw SQL queries (delegate to repository).
- No UI rendering code.

4. CLI (/cli) or GUI (/gui)
   Purpose: Handle interaction with the user.

What goes here:

- Collecting user input (from CLI flags or GUI fields).
- Passing data to services.
- Displaying output.

What doesn’t go here:

- No business rules.
- No SQL queries.

5. Assets (/assets or /gui/assets)
   Purpose: Contain static files for the GUI.

What goes here:

- HTML, CSS, JS, images, fonts, language JSONs.

What doesn’t go here:

- Go source code.
- SQL schema files.

6. Config (/config)
   Purpose: Store configuration and initialization code.

What goes here:

- Database connection setup.
- App-wide constants.
- Environment variable loading.

What doesn’t go here:

- Business logic.
- SQL queries.

7. Schema (/schema)
   Purpose: Store SQL schema definitions and migrations.

What goes here:

- .sql files for table creation.
- Migration scripts.

What doesn’t go here:

- Go code.

8. Utilities (/utils)
   Purpose: Store generic helper functions not tied to a specific model or service.

What goes here:

- Date formatting.
- File path helpers.
- Nullable value helpers.

What doesn’t go here:

- Business logic.

Rule of Thumb

- Models: "What data looks like."
- Repositories: "How to get and save the data."
- Services: "What to do with the data."
- UI Layer (CLI/GUI): "How the user interacts with the data."