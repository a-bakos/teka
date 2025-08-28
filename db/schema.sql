-- =========================
--  Schema
-- =========================

CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE profile_settings (
    profile_id INTEGER PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
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

CREATE TABLE collections (
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id)
);

CREATE TABLE creators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE item_creators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    creator_id INTEGER NOT NULL REFERENCES creators(id),
    role TEXT NOT NULL
);

CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER
);

CREATE TABLE profile_item_flags (
    profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    reading_status TEXT CHECK(reading_status IN ('reading', 'read')),
    is_favourite BOOLEAN DEFAULT 0,
    notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (profile_id, item_id)
);