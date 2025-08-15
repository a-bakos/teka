package repository

import (
	"database/sql"
	"teka/constants"
	"teka/db"
	"teka/models"
)

func CreateProfile(p models.Profile) (int64, error) {
	res, err := db.Conn.Exec("INSERT INTO profiles (name) VALUES (?)", p.Name)
	if err != nil {
		return constants.DbFailedInsertId, err
	}
	var id int64
	if id, err = res.LastInsertId(); err != nil {
		return constants.DbFailedInsertId, err
	}
	return id, nil
}

//func (r *profileRepository) GetProfileById(id int) (*models.Profile, error) {}

func GetProfileByName(name string) (*models.Profile, error) {
	var p models.Profile
	err := db.Conn.QueryRow("SELECT id, name FROM profiles WHERE name = ?", name).Scan(&p.ID, &p.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No profile found
		}
		return nil, err // Other error
	}
	return &p, nil
}

//func (r *profileRepository) UpdateProfile(p models.Profile) error {}

func DeleteProfile(id int) error {
	_, err := db.Conn.Exec("DELETE FROM profiles WHERE id = ?", id)
	return err
}
