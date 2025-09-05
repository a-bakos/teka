package services

import (
	"database/sql"
	"fmt"
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
	if db.Conn == nil {
		panic("DB connection is nil")
	}
	tx, err := db.Conn.Begin()
	if err != nil {
		util.Logger("%v", err)
		return constants.DbFailedInsertId
	}
	defer func() {
		if err != nil {
			util.Logger("%v", err)
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	util.Logger("Profile to add: %s", p.Name)

	// Attempt to get profile
	profile, errGetProfile := repository.GetProfile(tx, repository.GetProfileByName, p.Name)

	if errGetProfile != nil && errGetProfile != sql.ErrNoRows {
		util.Logger("Error: %v", errGetProfile)
		return int64(constants.ZeroValue)
	}
	// If found, can't insert
	if errGetProfile == nil && profile.ID != nil {
		util.Logger("Profile already exists: %s / %d", profile.Name, *profile.ID)
		return int64(*profile.ID)
	}

	// Insert profile into the database
	profileID, errInsert := repository.InsertProfile(tx, p)
	if errInsert != nil {
		util.Logger("Failed creating profile: %v", errInsert)
		return int64(constants.ZeroValue)
	}
	util.Logger("End for profile ID: %d", profileID)
	return profileID
}

func GetProfileByName(name string) (*models.Profile, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetProfile(tx, repository.GetProfileByName, name)
}

func GetProfileById(id string) (*models.Profile, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetProfile(tx, repository.GetProfileById, id)
}

func GetProfiles() []models.Profile {
	tx, err := db.Conn.Begin()
	if err != nil {
		return nil
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetProfiles(tx)
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

func GetCollection(profileId string) ([]models.Book, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetCollection(tx, profileId)
}

func AddToCollection(bookId, profileId string) bool {
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

	return repository.AddToCollection(tx, bookId, profileId)
}

func GetProfileItemFlags(profileId, itemId string) models.ProfileItemFlags {
	tx, err := db.Conn.Begin()
	if err != nil {
		return models.ProfileItemFlags{}
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetProfileItemFlags(tx, profileId, itemId)
}

func GetStats(profileId string) models.Stats {
	tx, err := db.Conn.Begin()
	if err != nil {
		return models.Stats{}
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	stats, err := repository.GetStats(tx, profileId)
	if err != nil {
		fmt.Println(err)
		return models.Stats{}
	}

	return stats
}

func GetProfileSettings(profileId string) models.ProfileSettings {
	tx, err := db.Conn.Begin()
	if err != nil {
		return models.ProfileSettings{}
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	return repository.GetProfileSettings(tx, profileId)
}
