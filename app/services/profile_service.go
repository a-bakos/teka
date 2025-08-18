package services

import (
	"teka/app/repository"
	"teka/constants"
	"teka/db"
	"teka/models"
	"teka/util"
)

func NewProfile(name string) models.Profile {
	name = util.ProcessProfileName(name)

	return models.Profile{
		ID:   nil, // ID is for retrieval
		Name: name,
	}
}

func CreateProfile(p *models.Profile) (int64, error) {
	tx, err := db.Conn.Begin()
	if err != nil {
		return constants.DbFailedInsertId, err
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
	if err != nil {
		return int64(constants.ZeroValue), err
	}
	// if found, can't insert
	if *profile.ID != constants.ZeroValue {
		util.Logger("Profile already exists: %s / %d", profile.Name, *profile.ID)
		return int64(*profile.ID), nil
	}

	// Insert profile into the database
	return repository.InsertProfile(tx, p)
}

func GetProfile() (*models.Profile, error) {
	return nil, nil
}
