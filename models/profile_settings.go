package models

type ProfileSettings struct {
	Profile
	Lang string `json:"lang"`
}
