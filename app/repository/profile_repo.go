package repository

import (
	"database/sql"
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
	id, err = res.LastInsertId()
	if err != nil {
		return constants.DbFailedInsertId, err
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

func GetProfile(tx *sql.Tx, by GetProfileBy, value string) (models.Profile, error) {
	switch by {
	case GetProfileByName:
		return getProfileByName(tx, value)
	case GetProfileById:
		return getProfileById(tx, value)
	default:
		return models.Profile{}, nil // todo
	}
}

func getProfileByName(tx *sql.Tx, name string) (models.Profile, error) {
	util.Logger("Getting profile by name: %s", name)
	var p models.Profile
	name = strings.TrimSpace(name)
	err := tx.QueryRow(`SELECT id, name FROM profiles WHERE name = ?`, name).Scan(&p.ID, &p.Name)
	if err == sql.ErrNoRows {
		util.Logger("Not found: %s (%s)", name, err)
		return models.Profile{}, nil
	}
	if err != nil && err != sql.ErrNoRows {
		util.Logger("Error: %s", err)
		return models.Profile{}, err
	}

	return p, nil
}

func getProfileById(tx *sql.Tx, id string) (models.Profile, error) {
	util.Logger("Getting profile by ID: %d", id)
	id = strings.TrimSpace(id)
	queriedID, err := util.StringToInt64(id)
	if err != nil {
		util.Logger("Error converting ID: %s", err)
		return models.Profile{}, err
	}
	var p models.Profile
	err = tx.QueryRow(`SELECT id, name FROM profiles WHERE id = ?`, queriedID).Scan(&p.ID, &p.Name)
	if err == sql.ErrNoRows {
		util.Logger("Not found: %s (%s)", id, err)
		return models.Profile{}, err
	}
	if err != nil && err != sql.ErrNoRows {
		util.Logger("Error: %s", err)
		return models.Profile{}, err
	}
	return p, nil
}

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
		util.Logger("Error deleting profile: %d (%v)", id, err)
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
