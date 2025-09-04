package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"teka/constants"
	"teka/models"
	"teka/util"
)

type GetProfileBy int

const (
	GetProfileByName GetProfileBy = iota
	GetProfileById
)

type DeleteProfileBy int

const (
	DeleteProfileByName DeleteProfileBy = iota
	DeleteProfileById
)

func InsertProfile(tx *sql.Tx, p *models.Profile) (int64, error) {
	res, err := tx.Exec(`INSERT INTO profiles (name) VALUES (?)`, p.Name)
	if err != nil {
		util.Logger("Error inserting profile: %v", err)
		return constants.DbFailedInsertId, err
	}
	var id int64
	id, errInsert := res.LastInsertId()
	if errInsert != nil {
		return constants.DbFailedInsertId, errInsert
	}
	util.Logger("Inserted profile ID: %d", id)
	return id, nil
}

func GetProfiles(tx *sql.Tx) []models.Profile {
	var profiles []models.Profile
	profileRows, err := tx.Query(`SELECT * FROM profiles`)
	if err != nil {
		util.Logger("Error %v", err)
		return profiles
	}
	if err == sql.ErrNoRows {
		return profiles
	}

	for profileRows.Next() {
		var p models.Profile
		err = profileRows.Scan(&p.ID, &p.Name)
		if err != nil {
			util.Logger("Error in processing profile rows %v", err)
			continue
		}

		profiles = append(profiles, p)
	}

	return profiles
}

func GetProfile(tx *sql.Tx, by GetProfileBy, value string) (*models.Profile, error) {
	switch by {
	case GetProfileByName:
		name := strings.TrimSpace(value)
		return queryProfile(tx, `SELECT id, name FROM profiles WHERE name = ?`, name)
	case GetProfileById:
		id := strings.TrimSpace(value)
		queriedId, err := util.StringToInt64(id)
		if err != nil {
			util.Logger("Error converting ID: %v", err)
			return nil, err
		}
		return queryProfile(tx, `SELECT id, name FROM profiles WHERE id = ?`, queriedId)
	default:
		return nil, fmt.Errorf("unsupported profile lookup: %v", by)
	}
}

func queryProfile(tx *sql.Tx, query string, arg interface{}) (*models.Profile, error) {
	var p models.Profile
	err := tx.QueryRow(query, arg).Scan(&p.ID, &p.Name)
	if err == sql.ErrNoRows {
		return nil, err
	}
	if err != nil {
		util.Logger("Query error: %v", err)
	}
	return &p, nil
}

// TODO : abstraction for the below functions
func DeleteProfile(tx *sql.Tx, by DeleteProfileBy, value string) (bool, error) {
	switch by {
	case DeleteProfileByName:
		return deleteProfileByName(tx, value)
	case DeleteProfileById:
		return deleteProfileById(tx, value)
	default:
		return false, nil
	}
}

func deleteProfileByName(tx *sql.Tx, name string) (bool, error) {
	res, err := tx.Exec("DELETE FROM profiles WHERE name = ?", name)
	if err != nil {
		util.Logger("Error deleting profile: %s (%v)", name, err)
		return false, err
	}
	var r int64
	r, err = res.RowsAffected()
	if err != nil {
		util.Logger("Error getting affected rows: %v", err)
		return false, err
	}
	if r > 0 {
		util.Logger("Deleted profile Name: %s", name)
		return true, err
	}
	if r == 0 && err == nil {
		util.Logger("Profile doesn't exist: %s", name)
	}
	return false, err
}

func deleteProfileById(tx *sql.Tx, id string) (bool, error) {
	res, err := tx.Exec("DELETE FROM profiles WHERE id = ?", id)
	if err != nil {
		util.Logger("Error deleting profile: %s (%v)", id, err)
		return false, err
	}
	var r int64
	r, err = res.RowsAffected()
	if err != nil {
		return false, err
	}
	if r > 0 {
		util.Logger("Deleted profile ID: %s", id)
		return true, err
	}
	if r == 0 && err == nil {
		util.Logger("Profile doesn't exist: %s", id)
	}

	return false, err
}

func GetCollection(tx *sql.Tx, profileId string) ([]models.Book, error) {
	rows, err := tx.Query(`
		SELECT 
			i.id AS item_id,
			i.title,
			i.description,
			i.item_type,
			i.created_at,
			i.updated_at,
			i.created_by,
			i.updated_by,
			b.isbn,
			b.publisher,
			b.published_date,
			b.page_count,
			GROUP_CONCAT(cr.name, ?) AS author_names -- group for multi-authors = author1+author2
		FROM collections c
		JOIN items i ON i.id = c.item_id
		JOIN books b ON b.item_id = i.id
		JOIN item_creators ic ON i.id = ic.item_id
		JOIN creators cr ON ic.creator_id = cr.id
		WHERE c.profile_id = ?
		GROUP BY 
			i.id, 
			i.title, 
			i.description, 
			i.item_type,
			i.created_at, 
			i.updated_at, 
			i.created_by, 
			i.updated_by,
			b.isbn, 
			b.publisher, 
			b.published_date, 
			b.page_count`,
		constants.MultiAuthorSeparator,
		profileId,
	)

	if err != nil {
		util.Logger("Error %v", err)
		return nil, err
	}

	var collection []models.Book
	for rows.Next() {
		var b models.Book

		err = rows.Scan(
			&b.Item.ID,
			&b.Item.Title,
			&b.Item.Description,
			&b.Item.ItemType,
			&b.Item.CreatedAt,
			&b.Item.UpdatedAt,
			&b.Item.CreatedBy,
			&b.Item.UpdatedBy,
			&b.ISBN,
			&b.Publisher,
			&b.PublishedDate,
			&b.PageCount,
			&b.AuthorNames,
		)
		if err != nil {
			util.Logger("Failed scan: %v", err)
			return nil, err
		}

		collection = append(collection, b)
	}

	return collection, nil
}

func GetProfileItemFlags(tx *sql.Tx, profileId, itemId string) models.ProfileItemFlags {
	var pif models.ProfileItemFlags
	err := tx.QueryRow(`
		SELECT
		    pif.profile_id,
		    pif.item_id,
		    pif.reading_status,
		    pif.is_favourite,
		    pif.notes,
		    pif.updated_at
		FROM profile_item_flags pif
		WHERE 
		    pif.profile_id = ?
		AND
		    pif.item_id = ?
	`, profileId, itemId).Scan(
		&pif.ProfileID,
		&pif.ItemID,
		&pif.Status,
		&pif.IsFavorite,
		&pif.Notes,
		&pif.UpdatedAt,
	)

	if err != nil {
		util.Logger("Error %v", err)
		return models.ProfileItemFlags{}
	}

	return pif
}

func GetStats(tx *sql.Tx, profileId string) (models.Stats, error) {
	var stats models.Stats

	err := tx.QueryRow(`
		SELECT
			COUNT (DISTINCT item_id) AS total,
			COUNT (DISTINCT item_id) FILTER (WHERE is_favourite = 1) AS favs,
			COUNT (DISTINCT item_id) FILTER (WHERE reading_status = ?) AS reading,
			COUNT (DISTINCT item_id) FILTER (WHERE reading_status = ?) AS read
		FROM profile_item_flags
		WHERE profile_id = ?
	`, constants.StatusReading, constants.StatusRead, profileId).Scan(
		&stats.MyBooks,
		&stats.MyFavs,
		&stats.Reading,
		&stats.Read,
	)

	if err != nil {
		util.Logger("Error %v", err)
		return models.Stats{}, err
	}

	return stats, nil
}
