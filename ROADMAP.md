# Code Typer Roadmap

## Current Priorities

- Completion screen: heatmap, blinking Enter key, current result summary, deltas from previous exercise.
- Completion UX cleanup: keep only the keyboard Enter hint after completion and do not duplicate top metrics below the editor.
- Persistent stats: recent sessions chart with speed above the axis and typos below it.
- Investigate rare early-session exercise restart or switch.
- Flexible tab input: accept either a real Tab key or exactly the configured tab-width spaces for expected tab characters; blink both Tab and Space when a tab can be entered both ways.
- Exercise pools: choose the next exercise randomly from the active pool after completion; later allow topic pools such as Go channels, goroutines, maps, slices, syntax drills.
- Typed buffer model: wrong characters before a newline should appear on the current line and should not advance to the next target line until Enter is actually typed.
- Heatmap history: count all mistakes, including mistakes that were later fixed with Backspace.
- Modifier key feedback: show pressed state for Shift, Control, Option, Command, and other service keys.
- User audio: choose a custom error sound file, keep the current generated fallback.
- Theme controls: background opacity, accent color, and saved theme presets.
- Syntax highlighting toggle: notebook mode without highlighting and IDE mode with highlighting.
- Write a useful README with the product idea, local development flow, Wails build flow, and current feature list.

## Later

- Import user snippets and offline snippet packs.
- Layout support beyond QWERTY.
- Optional words-per-minute display refinements.
