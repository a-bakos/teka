package repository

import (
	"database/sql"
	"strings"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

type GetProfileBy int

const (
	GetProfileByName GetProfileBy = iota
	GetProfileById
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

func DeleteProfile(id int) error {
	_, err := db.Conn.Exec("DELETE FROM profiles WHERE id = ?", id)
	return err
}
