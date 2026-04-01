package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := &App{} // создаём экземпляр App

	// создаём и запускаем Wails приложение
	err := wails.Run(&options.App{
		Title:  "Code Typer",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets, // подключаем фронтенд dist
		},
		Bind: []interface{}{
			app, // связываем Go App с JS
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
