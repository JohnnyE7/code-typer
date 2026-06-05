package main

import (
	"code-typer/engine"
	"context"
	"sync"
)

type App struct {
	ctx context.Context
	mu  sync.Mutex

	engine  *engine.Engine
	current Exercise
}

type AppState struct {
	Exercise Exercise            `json:"exercise"`
	Render   []engine.RenderChar `json:"render"`
	Stats    engine.Stats        `json:"stats"`
	Expected string              `json:"expected"`
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ListExercises() []Exercise {
	return exercises
}

func (a *App) StartExercise(id string) AppState {
	a.mu.Lock()
	defer a.mu.Unlock()

	exercise := findExercise(id)
	a.current = exercise
	a.engine = engine.NewEngine(exercise.Code)

	return a.stateLocked()
}

func (a *App) HandleInput(input string) AppState {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.ensureSessionLocked()
	a.engine.HandleInput(input)

	return a.stateLocked()
}

func (a *App) Backspace() AppState {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.ensureSessionLocked()
	a.engine.Backspace()

	return a.stateLocked()
}

func (a *App) GetSession() AppState {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.ensureSessionLocked()
	return a.stateLocked()
}

func (a *App) ensureSessionLocked() {
	if a.engine != nil {
		return
	}

	a.current = findExercise("")
	a.engine = engine.NewEngine(a.current.Code)
}

func (a *App) stateLocked() AppState {
	if a.engine == nil {
		return AppState{}
	}

	return AppState{
		Exercise: a.current,
		Render:   a.engine.Render(),
		Stats:    a.engine.Stats(),
		Expected: a.engine.Expected(),
	}
}
