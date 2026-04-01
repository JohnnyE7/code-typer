package main

import (
	"code-typer/engine"
	"context"
)

type App struct {
	ctx    context.Context
	engine *engine.Engine
}

// Запуск упражнения
func (a *App) StartExercise(text string) {
	a.engine = engine.NewEngine(text)
}

// Обработка нажатия
func (a *App) KeyPress(key string) {
	if a.engine == nil || len(key) == 0 {
		return
	}
	r := []rune(key)[0]
	a.engine.HandleKey(r)
}

// Обработка Backspace
func (a *App) Backspace() {
	if a.engine == nil {
		return
	}
	a.engine.Backspace()
}

// Получение состояния для UI
func (a *App) GetRender() []engine.RenderChar {
	if a.engine == nil {
		return nil
	}
	return a.engine.Render()
}

// Получение статистики
func (a *App) GetStats() map[string]int {
	if a.engine == nil {
		return map[string]int{
			"Index": 0,
			"Typos": 0,
		}
	}
	return map[string]int{
		"Index": a.engine.Index,
		"Typos": a.engine.Typos,
	}
}
