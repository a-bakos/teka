package services

import (
	"database/sql"
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

func NewProfile(name string, id *int) models.Profile {
	name = util.ProcessProfileName(name)

	return models.Profile{
		ID:   id, // ID is for retrieval
		Name: name,
	}
}

func CreateProfile(p *models.Profile) int64 {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.DbFailedInsertId
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	util.Logger("Profile to add: %s", p.Name)

	// Attempt to get profile
	profile, err := repository.GetProfile(tx, repository.GetProfileByName, p.Name)

	if err != nil && err != sql.ErrNoRows {
		util.Logger("Error: %v", err)
		return int64(constants.ZeroValue)
	}
	// If found, can't insert
	if err == nil && profile.ID != nil {
		util.Logger("Profile already exists: %s / %d", profile.Name, *profile.ID)
		return int64(*profile.ID)
	}

	// Insert profile into the database
	profileID, e := repository.InsertProfile(tx, p)
	if e != nil {
		util.Logger("Failed creating profile: %v", e)
		return int64(constants.ZeroValue)
	}
	util.Logger("End for profile ID: %d", profileID)
	return profileID
}

func GetProfile() (*models.Profile, error) {
	return nil, nil
}

func DeleteProfile(by repository.DeleteProfileBy, value string) bool {
	tx, err := db.Conn.Begin()
	if err != nil {
		return false
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	deleted, e := repository.DeleteProfile(tx, by, value)
	if e != nil {
		util.Logger("Failed deleting profile: %s (%v)", value, e)
		return false
	}
	if deleted == true {
		util.Logger("Profile deleted successfully! %s", value)
		return true
	}
	return false
}
