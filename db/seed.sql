-- =========================
-- Dummy Data (Seed)
-- =========================

-- Profiles
INSERT INTO profiles (name)
VALUES ('Alice'),
       ('Bob'),
       ('Charlie'),
       ('Diana');

-- Profile Settings
INSERT INTO profile_settings (profile_id, language)
VALUES (1, 'en'),
       (2, 'hu'),
       (3, 'hu'),
       (4, 'en');

-- Items (Books and others)
INSERT INTO items (title, description, item_type, created_by)
VALUES ('The Great Adventure', 'An epic journey across lands.', 'book', 1),
       ('Cooking 101', 'Basics of cooking delicious meals.', 'book', 2),
       ('Space Odyssey Poster', 'Limited edition poster.', 'poster', 3),
       ('Music Album: Rising Stars', 'Debut album by Rising Stars band.', 'music', 4),
       ('The Mystery Novel', 'A thrilling detective story.', 'book', 1),
       ('Gardening Tips', 'How to grow vegetables at home.', 'book', 2);

-- Books (only for book items)
INSERT INTO books (item_id, isbn, publisher, published_date, page_count)
VALUES (1, '9781111111111', 'Adventure House', '2019-05-10', 450),
       (2, '9782222222222', 'Kitchen Press', '2020-08-25', 180),
       (5, '9783333333333', 'Detective Works', '2021-11-05', 320),
       (6, '9784444444444', 'Green Earth', '2018-03-15', 150);

-- Collections
INSERT INTO collections (profile_id, item_id)
VALUES (1, 1),
       (1, 2),
       (2, 5),
       (2, 6),
       (3, 3),
       (4, 4);

-- Creators
INSERT INTO creators (name)
VALUES ('John Smith'),
       ('Marie Curie'),
       ('Alan Turing'),
       ('Jane Doe'),
       ('Carlos Ruiz'),
       ('Band: Rising Stars');

-- Item Creators
INSERT INTO item_creators (item_id, creator_id, role)
VALUES (1, 1, 'author'),
       (2, 2, 'author'),
       (3, 3, 'designer'),
       (4, 6, 'musician'),
       (5, 4, 'author'),
       (6, 5, 'author');

-- Images
INSERT INTO images (item_id, file_path, caption, sort_order)
VALUES (1, 'great_adventure_cover.png', 'Book Cover', 1),
       (2, 'cooking101_cover.png', 'Book Cover', 1),
       (3, 'space_poster.png', 'Poster Design', 1),
       (4, 'rising_stars_album.png', 'Album Cover', 1),
       (5, 'mystery_novel_cover.png', 'Book Cover', 1),
       (6, 'gardening_tips_cover.png', 'Book Cover', 1);

-- Profile Item Flags
INSERT INTO profile_item_flags (profile_id, item_id, reading_status, is_favourite, notes)
VALUES (1, 1, 'reading', 1, 'Almost halfway through.'),
       (1, 2, 'read', 0, 'Tried a few recipes.'),
       (2, 5, 'reading', 1, 'Loving the mystery vibe.'),
       (2, 6, 'read', 0, 'Good reference for gardening.'),
       (3, 3, NULL, 1, 'Poster looks great on my wall.'),
       (4, 4, NULL, 0, 'Listening daily.');
