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
	res, err := tx.Exec("INSERT INTO profiles (name) VALUES (?)", p.Name)
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

func GetProfile(tx *sql.Tx, by GetProfileBy, value string) (*models.Profile, error) {
	switch by {
	case GetProfileByName:
		return getProfileByName(tx, value)
	case GetProfileById:
		return getProfileById(tx, value)
	default:
		return nil, nil // todo
	}
}

func getProfileByName(tx *sql.Tx, name string) (*models.Profile, error) {
	util.Logger("Getting profile by name: %s", name)
	var id int64
	var profileName string
	name = strings.TrimSpace(name)
	err := tx.QueryRow(`SELECT id, name FROM profiles WHERE name = ?`, name).Scan(&id, &profileName)
	if err == sql.ErrNoRows {
		util.Logger("Not found: %s (%s)", name, err)
		return nil, err
	}
	if err != nil && err != sql.ErrNoRows {
		util.Logger("Error: %s", err)
		return nil, err
	}

	idInt := int(id) // convert id to int, take its address, and pass it as *int
	return &models.Profile{
		ID:   &idInt,
		Name: profileName,
	}, nil

}

func getProfileById(tx *sql.Tx, id string) (*models.Profile, error) {
	util.Logger("Getting profile by ID: %d", id)
	// todo
	return nil, nil
}

//func GetProfileByName(name string) (*models.Profile, error) {
//	var p models.Profile
//	err := db.Conn.QueryRow("SELECT id, name FROM profiles WHERE name = ?", name).Scan(&p.ID, &p.Name)
//	if err != nil {
//		if err == sql.ErrNoRows {
//			return nil, nil // No profile found
//		}
//		return nil, err // Other error
//	}
//	return &p, nil
//}

//func (r *profileRepository) UpdateProfile(p models.Profile) error {}

func DeleteProfile(id int) error {
	_, err := db.Conn.Exec("DELETE FROM profiles WHERE id = ?", id)
	return err
}
