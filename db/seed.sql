-- =========================
--  Dummy Data
-- =========================

INSERT INTO profiles (name) VALUES ('Admin');
INSERT INTO profiles (name) VALUES ('Alice');
INSERT INTO profiles (name) VALUES ('Bob');

INSERT INTO profile_settings (profile_id, language) VALUES (1, 'en');
INSERT INTO profile_settings (profile_id, language) VALUES (2, 'hu');
INSERT INTO profile_settings (profile_id, language) VALUES (3, 'en');

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
