package main

import (
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"teka/app/services"
	"teka/db"
	"teka/models"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	if err := db.Init("../temp/tekatest.db"); err != nil {
		panic(err)
	}
}

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	dialog, err := runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   "Quit?",
		Message: "Are you sure you want to quit?",
	})

	if err != nil {
		return false
	}
	return dialog != "Yes"
}

func (a *App) onSecondInstanceLaunch(data options.SecondInstanceData) {
	if a.ctx != nil {
		runtime.WindowShow(a.ctx)
		// Trick to bring it to front
		runtime.WindowSetAlwaysOnTop(a.ctx, true)
		runtime.WindowSetAlwaysOnTop(a.ctx, false)
	}
	// Debug: log args from 2nd instance
	fmt.Println("Second instance args:", data.Args)
}

// ---------------- //
// Backend bindings //
// ---------------- //

// ------------------------
// From frontend to backend
// ------------------------

func (a *App) CreateProfile(name string) int64 {
	profile := services.NewProfile(name, nil)
	id := services.CreateProfile(&profile)
	return id
}

func (a *App) DeleteBook(id string) bool {
	return services.DeleteBook(id)
}

// todo
// addBook
// updateBook

// ------------------------
// From backend to frontend
// ------------------------

func (a *App) GetProfiles() []models.Profile {
	return services.GetProfiles()
}

func (a *App) GetBooks() []models.Book {
	return services.GetBooks()
}

func (a *App) GetBook(id string) models.Book {
	return services.GetBook(id)
}

func (a *App) GetProfileItemFlags(profileId, itemId string) models.ProfileItemFlags {
	return services.GetProfileItemFlags(profileId, itemId)
}
