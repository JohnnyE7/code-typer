package engine

import (
	"math"
	"time"
)

type CharState string

const (
	Pending   CharState = "pending"
	Correct   CharState = "correct"
	Incorrect CharState = "incorrect"
)

type Clock func() time.Time

type Engine struct {
	Target       []rune
	State        []CharState
	Index        int
	Typos        int
	TypedCount   int
	CorrectCount int

	startedAt  time.Time
	finishedAt time.Time
	clock      Clock
}

type RenderChar struct {
	Char  string    `json:"char"`
	State CharState `json:"state"`
}

type Stats struct {
	Index        int     `json:"index"`
	Total        int     `json:"total"`
	TypedCount   int     `json:"typedCount"`
	CorrectCount int     `json:"correctCount"`
	Typos        int     `json:"typos"`
	Accuracy     int     `json:"accuracy"`
	SpeedCPM     int     `json:"speedCpm"`
	Progress     float64 `json:"progress"`
	Complete     bool    `json:"complete"`
	ElapsedMs    int64   `json:"elapsedMs"`
}

func NewEngine(text string) *Engine {
	return NewEngineWithClock(text, time.Now)
}

func NewEngineWithClock(text string, clock Clock) *Engine {
	runes := []rune(text)
	state := make([]CharState, len(runes))
	for i := range state {
		state[i] = Pending
	}

	return &Engine{
		Target: runes,
		State:  state,
		clock:  clock,
	}
}

func (e *Engine) HandleInput(input string) {
	for _, r := range []rune(input) {
		e.handleRune(r)
	}
}

func (e *Engine) Backspace() {
	if e.Index == 0 {
		return
	}

	e.Index--
	e.State[e.Index] = Pending
	e.finishedAt = time.Time{}
}

func (e *Engine) Render() []RenderChar {
	out := make([]RenderChar, len(e.Target))
	for i := range e.Target {
		out[i] = RenderChar{
			Char:  string(e.Target[i]),
			State: e.State[i],
		}
	}
	return out
}

func (e *Engine) Stats() Stats {
	total := len(e.Target)
	now := e.now()
	elapsed := e.elapsed(now)
	complete := total > 0 && e.Index >= total

	progress := 0.0
	if total > 0 {
		progress = float64(e.Index) / float64(total)
	}

	return Stats{
		Index:        e.Index,
		Total:        total,
		TypedCount:   e.TypedCount,
		CorrectCount: e.CorrectCount,
		Typos:        e.Typos,
		Accuracy:     e.accuracy(),
		SpeedCPM:     e.speedCPM(elapsed),
		Progress:     progress,
		Complete:     complete,
		ElapsedMs:    elapsed.Milliseconds(),
	}
}

func (e *Engine) Expected() string {
	if e.Index >= len(e.Target) {
		return ""
	}
	return string(e.Target[e.Index])
}

func (e *Engine) handleRune(r rune) {
	if e.Index >= len(e.Target) {
		return
	}

	if e.startedAt.IsZero() {
		e.startedAt = e.now()
	}

	expected := e.Target[e.Index]
	if r == expected {
		e.State[e.Index] = Correct
		e.CorrectCount++
	} else {
		e.State[e.Index] = Incorrect
		e.Typos++
	}

	e.TypedCount++
	e.Index++

	if e.Index >= len(e.Target) && e.finishedAt.IsZero() {
		e.finishedAt = e.now()
	}
}

func (e *Engine) accuracy() int {
	if e.TypedCount == 0 {
		return 100
	}
	return int(math.Round(float64(e.CorrectCount) / float64(e.TypedCount) * 100))
}

func (e *Engine) speedCPM(elapsed time.Duration) int {
	if e.TypedCount == 0 || elapsed <= 0 {
		return 0
	}
	if elapsed < time.Second {
		elapsed = time.Second
	}
	return int(math.Round(float64(e.TypedCount) / elapsed.Minutes()))
}

func (e *Engine) elapsed(now time.Time) time.Duration {
	if e.startedAt.IsZero() {
		return 0
	}
	if !e.finishedAt.IsZero() {
		return e.finishedAt.Sub(e.startedAt)
	}
	if now.Before(e.startedAt) {
		return 0
	}
	return now.Sub(e.startedAt)
}

func (e *Engine) now() time.Time {
	if e.clock == nil {
		return time.Now()
	}
	return e.clock()
}
