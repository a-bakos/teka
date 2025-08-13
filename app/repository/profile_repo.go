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

const FailedInsertId int = 0

func (r *profileRepository) CreateProfile(p models.Profile) (int, error){
	res, err := r.db.Exec("INSERT INTO profiles (name) VALUES (?)", p.Name)
	if err != nil {
		return FailedInsertId, err
	}
	var id int64
	if id, err = res.LastInsertId(); err != nil {
		return FailedInsertId, err
	}
	return int(id), nil
}

