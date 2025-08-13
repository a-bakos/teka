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
