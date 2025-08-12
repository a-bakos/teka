-- =========================
-- Reset Script: Drops all tables and recreates schema with dummy data
-- =========================

PRAGMA foreign_keys = OFF;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS profile_item_flags;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS item_creators;
DROP TABLE IF EXISTS creators;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS profile_settings;
DROP TABLE IF EXISTS profiles;

PRAGMA foreign_keys = ON;

-- =========================
--  Schema
-- =========================

CREATE TABLE profiles (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          name TEXT NOT NULL
);

CREATE TABLE profile_settings (
                                  profile_id INTEGER PRIMARY KEY REFERENCES profiles(id),
                                  language TEXT
);

CREATE TABLE items (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       title TEXT NOT NULL,
                       description TEXT,
                       item_type TEXT NOT NULL DEFAULT 'book',
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME,
                       created_by INTEGER REFERENCES profiles(id),
                       updated_by INTEGER REFERENCES profiles(id)
);

CREATE TABLE books (
                       item_id INTEGER PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
                       isbn TEXT,
                       publisher TEXT,
                       published_date DATE,
                       page_count INTEGER
);

CREATE TABLE creators (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          name TEXT NOT NULL
);

CREATE TABLE item_creators (
                               item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
                               creator_id INTEGER REFERENCES creators(id),
                               role TEXT DEFAULT 'author',
                               PRIMARY KEY (item_id, creator_id, role)
);

CREATE TABLE images (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
                        file_path TEXT NOT NULL,
                        caption TEXT,
                        sort_order INTEGER
);

CREATE TABLE profile_item_flags (
                                    profile_id INTEGER,
                                    item_id INTEGER,
                                    reading_status TEXT CHECK(reading_status IN ('reading', 'read')),
                                    is_favourite BOOLEAN DEFAULT 0,
                                    notes TEXT,
                                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (profile_id, item_id),
                                    FOREIGN KEY (profile_id) REFERENCES profiles(id),
                                    FOREIGN KEY (item_id) REFERENCES items(id)
);

-- =========================
--  Dummy Data
-- =========================

INSERT INTO profiles (name) VALUES ('Alice');
INSERT INTO profiles (name) VALUES ('Bob');

INSERT INTO profile_settings (profile_id, language) VALUES (1, 'en');
INSERT INTO profile_settings (profile_id, language) VALUES (2, 'hu');

INSERT INTO items (title, description, item_type, created_by)
VALUES ('The Hobbit', 'A fantasy novel by J.R.R. Tolkien.', 'book', 1);

INSERT INTO items (title, description, item_type, created_by)
VALUES ('1984', 'A dystopian social science fiction novel by George Orwell.', 'book', 2);

INSERT INTO books (item_id, isbn, publisher, published_date, page_count)
VALUES (1, '978-0547928227', 'George Allen & Unwin', '1937-09-21', 310);

INSERT INTO books (item_id, isbn, publisher, published_date, page_count)
VALUES (2, '978-0451524935', 'Secker & Warburg', '1949-06-08', 328);

INSERT INTO creators (name) VALUES ('J.R.R. Tolkien');
INSERT INTO creators (name) VALUES ('George Orwell');

INSERT INTO item_creators (item_id, creator_id, role) VALUES (1, 1, 'author');
INSERT INTO item_creators (item_id, creator_id, role) VALUES (2, 2, 'author');

INSERT INTO images (item_id, file_path, caption, sort_order)
VALUES (1, 'images/the_hobbit_cover.jpg', 'Original book cover', 1);

INSERT INTO images (item_id, file_path, caption, sort_order)
VALUES (2, 'images/1984_cover.jpg', 'Cover art', 1);

INSERT INTO profile_item_flags (profile_id, item_id, reading_status, is_favourite, notes)
VALUES (1, 1, 'read', 1, 'One of my favourites!');

INSERT INTO profile_item_flags (profile_id, item_id, reading_status, is_favourite, notes)
VALUES (2, 2, 'reading', 0, 'Halfway through.');
