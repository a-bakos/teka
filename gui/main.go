package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "Teka",
		Width:     1024,
		Height:    768,
		MinWidth:  1024,
		MinHeight: 768,
		MaxWidth:  1920,
		MaxHeight: 1200,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnBeforeClose:            app.beforeClose,
		EnableDefaultContextMenu: false,
		BackgroundColour:         &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:                app.startup,
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "c9c8fd93-6758-4144-87d1-34bdb0a8bd60",
			OnSecondInstanceLaunch: app.onSecondInstanceLaunch,
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: true,
		},
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
