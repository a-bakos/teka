package repository

import (
	"database/sql"
	"teka/models"
)

//type DBConnection struct {
//	db *sql.DB
//}
//
//func New() (*DBConnection, error) {
//	db, err := sql.Open("sqlite3", "file:profile.db?cache=shared&mode=memory")
//	if err != nil {
//		return nil, err
//	}
//	return &DBConnection{db: db}, nil
//
//}
//

type profileRepository struct{ db *sql.DB }

var ProfileRepo = &profileRepository{db: ??}

const DbFailedInsertId int = 0

func (r *profileRepository) CreateProfile(p models.Profile) (int, error) {
	res, err := r.db.Exec("INSERT INTO profiles (name) VALUES (?)", p.Name)
	if err != nil {
		return DbFailedInsertId, err
	}
	var id int64
	if id, err = res.LastInsertId(); err != nil {
		return DbFailedInsertId, err
	}
	return int(id), nil
}

func (r *profileRepository) GetProfileById(id int) (*models.Profile, error) {}

func (r *profileRepository) GetProfileByName(name string) (*models.Profile, error) {
	var p models.Profile
	err := r.db.QueryRow("SELECT id, name FROM profiles WHERE name = ?", name).Scan(&p.ID, &p.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // No profile found
		}
		return nil, err // Other error
	}
	return &p, nil
}

func (r *profileRepository) UpdateProfile(p models.Profile) error {}

func (r *profileRepository) DeleteProfile(id int) error {
	_, err := r.db.Exec("DELETE FROM profiles WHERE id = ?", id)
	return err
}

