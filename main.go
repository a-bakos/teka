package main

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"teka/app"
	"teka/constants"
	"teka/db"
)

func main() {
	var err error
	db.Conn, err = sql.Open(constants.DbDriver, constants.DbPath)
	if err != nil {
		panic(err)
	}
	defer db.Conn.Close()

	appRuntime := app.App{
		Config: app.AppConfig{
			CurrentUserID: 1,
		},
	}
	appRuntime.Run()
}
