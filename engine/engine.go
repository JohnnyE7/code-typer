package engine

type CharState int

const (
	Pending CharState = iota
	Correct
	Incorrect
)

type Engine struct {
	Target []rune
	State  []CharState
	Index  int
	Typos  int
}

func NewEngine(text string) *Engine {
	runes := []rune(text)
	state := make([]CharState, len(runes))
	return &Engine{
		Target: runes,
		State:  state,
	}
}

// Обработка нажатия
func (e *Engine) HandleKey(r rune) {
	if e.Index >= len(e.Target) {
		return
	}

	expected := e.Target[e.Index]

	if r == expected {
		e.State[e.Index] = Correct
	} else {
		e.State[e.Index] = Incorrect
		e.Typos++
	}

	e.Index++
}

// Обработка Backspace
func (e *Engine) Backspace() {
	if e.Index == 0 {
		return
	}
	e.Index--
	e.State[e.Index] = Pending
}

// Возвращаем состояние для рендера
type RenderChar struct {
	Char  rune
	State CharState
}

func (e *Engine) Render() []RenderChar {
	out := make([]RenderChar, len(e.Target))
	for i := range e.Target {
		out[i] = RenderChar{
			Char:  e.Target[i],
			State: e.State[i],
		}
	}
	return out
}
