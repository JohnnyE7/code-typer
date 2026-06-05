package engine

import (
	"testing"
	"time"
)

func TestHandleInputTracksRenderStateAndStats(t *testing.T) {
	now := time.Date(2026, 6, 5, 12, 0, 0, 0, time.UTC)
	engine := NewEngineWithClock("abc", func() time.Time {
		return now
	})

	engine.HandleInput("a")
	now = now.Add(30 * time.Second)
	engine.HandleInput("x")

	render := engine.Render()
	if render[0].State != Correct {
		t.Fatalf("first char state = %q, want %q", render[0].State, Correct)
	}
	if render[1].State != Incorrect {
		t.Fatalf("second char state = %q, want %q", render[1].State, Incorrect)
	}
	if render[2].State != Pending {
		t.Fatalf("third char state = %q, want %q", render[2].State, Pending)
	}

	stats := engine.Stats()
	if stats.Index != 2 {
		t.Fatalf("index = %d, want 2", stats.Index)
	}
	if stats.TypedCount != 2 {
		t.Fatalf("typed count = %d, want 2", stats.TypedCount)
	}
	if stats.CorrectCount != 1 {
		t.Fatalf("correct count = %d, want 1", stats.CorrectCount)
	}
	if stats.Typos != 1 {
		t.Fatalf("typos = %d, want 1", stats.Typos)
	}
	if stats.Accuracy != 50 {
		t.Fatalf("accuracy = %d, want 50", stats.Accuracy)
	}
}

func TestBackspaceOnlyMovesCursorAndRenderState(t *testing.T) {
	now := time.Date(2026, 6, 5, 12, 0, 0, 0, time.UTC)
	engine := NewEngineWithClock("ab", func() time.Time {
		return now
	})

	engine.HandleInput("x")
	engine.Backspace()

	stats := engine.Stats()
	if stats.Index != 0 {
		t.Fatalf("index = %d, want 0", stats.Index)
	}
	if stats.TypedCount != 1 {
		t.Fatalf("typed count = %d, want 1", stats.TypedCount)
	}
	if stats.Typos != 1 {
		t.Fatalf("typos = %d, want 1", stats.Typos)
	}
	if stats.Accuracy != 0 {
		t.Fatalf("accuracy = %d, want 0", stats.Accuracy)
	}

	render := engine.Render()
	if render[0].State != Pending {
		t.Fatalf("first char state = %q, want %q", render[0].State, Pending)
	}
}

func TestSpeedNeverGoesNegativeAfterBackspace(t *testing.T) {
	now := time.Date(2026, 6, 5, 12, 0, 0, 0, time.UTC)
	engine := NewEngineWithClock("abcdef", func() time.Time {
		return now
	})

	engine.HandleInput("abc")
	now = now.Add(30 * time.Second)
	engine.Backspace()
	engine.Backspace()
	now = now.Add(30 * time.Second)

	stats := engine.Stats()
	if stats.Index != 1 {
		t.Fatalf("index = %d, want 1", stats.Index)
	}
	if stats.TypedCount != 3 {
		t.Fatalf("typed count = %d, want 3", stats.TypedCount)
	}
	if stats.SpeedCPM != 3 {
		t.Fatalf("speed cpm = %d, want 3", stats.SpeedCPM)
	}
	if stats.SpeedCPM < 0 {
		t.Fatalf("speed cpm = %d, want non-negative", stats.SpeedCPM)
	}
}

func TestSpeedFreezesWhenExerciseCompletes(t *testing.T) {
	now := time.Date(2026, 6, 5, 12, 0, 0, 0, time.UTC)
	engine := NewEngineWithClock("ab", func() time.Time {
		return now
	})

	engine.HandleInput("a")
	now = now.Add(30 * time.Second)
	engine.HandleInput("b")
	now = now.Add(30 * time.Second)

	stats := engine.Stats()
	if !stats.Complete {
		t.Fatal("complete = false, want true")
	}
	if stats.SpeedCPM != 4 {
		t.Fatalf("speed cpm = %d, want 4", stats.SpeedCPM)
	}
}

func TestExpectedReturnsNextRune(t *testing.T) {
	engine := NewEngine("a\n\tb")

	if got := engine.Expected(); got != "a" {
		t.Fatalf("expected = %q, want %q", got, "a")
	}

	engine.HandleInput("a")
	if got := engine.Expected(); got != "\n" {
		t.Fatalf("expected = %q, want newline", got)
	}

	engine.HandleInput("\n")
	if got := engine.Expected(); got != "\t" {
		t.Fatalf("expected = %q, want tab", got)
	}
}
