-- ===============================
-- SCHEMA CREATION
-- ===============================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        name TEXT NOT NULL
);

-- Profile settings table
CREATE TABLE IF NOT EXISTS profile_settings (
                                                profile_id INTEGER PRIMARY KEY REFERENCES profiles(id),
    language TEXT NOT NULL DEFAULT 'en'
    );

-- Items table
CREATE TABLE IF NOT EXISTS items (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     title TEXT NOT NULL,
                                     description TEXT,
                                     item_type TEXT NOT NULL DEFAULT 'book',
                                     created_at DATETIME NOT NULL,
                                     updated_at DATETIME NOT NULL,
                                     created_by INTEGER REFERENCES profiles(id),
    updated_by INTEGER REFERENCES profiles(id)
    );

-- Books metadata table
CREATE TABLE IF NOT EXISTS books (
                                     item_id INTEGER PRIMARY KEY REFERENCES items(id),
    isbn TEXT,
    publisher TEXT,
    published_date DATE,
    page_count INTEGER
    );

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        name TEXT NOT NULL
);

-- Item-creators link table
CREATE TABLE IF NOT EXISTS item_creators (
                                             item_id INTEGER REFERENCES items(id),
    creator_id INTEGER REFERENCES creators(id),
    role TEXT,
    PRIMARY KEY (item_id, creator_id, role)
    );

-- Images table
CREATE TABLE IF NOT EXISTS images (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      item_id INTEGER REFERENCES items(id),
    file_path TEXT,
    url TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0
    );

-- Profile-item flags table
CREATE TABLE IF NOT EXISTS profile_item_flags (
                                                  profile_id INTEGER REFERENCES profiles(id),
    item_id INTEGER REFERENCES items(id),
    is_favourite BOOLEAN DEFAULT 0,
    is_read BOOLEAN DEFAULT 0,
    read_at DATETIME,
    notes TEXT,
    PRIMARY KEY (profile_id, item_id)
    );

-- ===============================
-- DUMMY DATA INSERTION
-- ===============================

-- Insert profiles
INSERT INTO profiles (name) VALUES ('Alice'), ('Bob');

-- Insert profile settings
INSERT INTO profile_settings (profile_id, language) VALUES (1, 'en'), (2, 'hu');

-- Insert items (books)
INSERT INTO items (title, description, item_type, created_at, updated_at, created_by, updated_by)
VALUES
    ('The Great Gatsby', 'A classic novel by F. Scott Fitzgerald.', 'book', '2025-08-11', '2025-08-11', 1, 1),
    ('1984', 'Dystopian novel by George Orwell.', 'book', '2025-08-10', '2025-08-10', 2, 2);

-- Insert book-specific metadata
INSERT INTO books (item_id, isbn, publisher, published_date, page_count)
VALUES
    (1, '9780743273565', 'Scribner', '1925-04-10', 180),
    (2, '9780451524935', 'Signet Classic', '1949-06-08', 328);

-- Insert creators (authors)
INSERT INTO creators (name) VALUES ('F. Scott Fitzgerald'), ('George Orwell');

-- Link items and creators
INSERT INTO item_creators (item_id, creator_id, role)
VALUES
    (1, 1, 'author'),
    (2, 2, 'author');

-- Insert images
INSERT INTO images (item_id, file_path, caption, sort_order)
VALUES
    (1, '/images/gatsby_cover.jpg', 'Front Cover', 1),
    (1, '/images/gatsby_back.jpg', 'Back Cover', 2),
    (2, '/images/1984_cover.jpg', 'Front Cover', 1);

-- Insert profile-item flags
INSERT INTO profile_item_flags (profile_id, item_id, is_favourite, is_read, read_at, notes)
VALUES
    (1, 1, 1, 1, '2025-07-01', 'Loved the symbolism and writing style.'),
    (1, 2, 0, 0, NULL, NULL),
    (2, 2, 1, 1, '2025-08-05', 'Thought-provoking dystopia.');
