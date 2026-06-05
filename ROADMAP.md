# Code Typer Roadmap

## Current Priorities

- Persistent stats: recent sessions chart with speed above the axis and typos below it; include deltas against previous completed exercises there.
- Investigate rare early-session exercise restart or switch.
- Flexible tab input: accept either a real Tab key or exactly the configured tab-width spaces for expected tab characters; blink both Tab and Space when a tab can be entered both ways.
- Topic exercise pools: allow focused pools such as Go channels, goroutines, maps, slices, syntax drills.
- Typed buffer model: wrong characters before a newline should appear on the current line and should not advance to the next target line until Enter is actually typed.
- User audio: choose a custom error sound file, keep the current generated fallback.
- Theme presets: save and switch complete color/theme presets, including opaque non-translucent app themes.
- Syntax highlighting research and toggle: evaluate existing web libraries such as Shiki, Prism, Highlight.js, or CodeMirror, then add notebook mode without highlighting and IDE mode with highlighting.
- Selection polish: only code text should be selectable; UI chrome and line numbers should stay non-selectable.
- Continue frontend decomposition: split remaining `main.js` responsibilities into focused modules for settings, typing input, audio, and completion flow.
- Write a useful README with the product idea, local development flow, Wails build flow, and current feature list.

## Later

- Import user snippets and offline snippet packs.
- Layout support beyond QWERTY.
- Optional words-per-minute display refinements.

## Done

- Completion screen basics: heatmap, blinking keyboard Enter key, and restart on Enter.
- Completion UX cleanup: keep only the keyboard Enter hint after completion and do not duplicate top metrics below the editor.
- Heatmap history: count all mistakes, including mistakes that were later fixed with Backspace.
- Modifier key feedback: show pressed state for Shift, Control, Option, Command, and other service keys.
- Settings cleanup: keep tab width only, remove tabs/spaces mode, add smoother background opacity control.
- Active language pool: after completion, Enter starts a random next exercise from the current language instead of repeating the same snippet.
- README: product idea, local development flow, Wails build flow, feature list, and current limitations.
- README_RUS: Russian product and development documentation.
- Completion hotkeys: Enter starts the next random exercise, while Cmd+R restarts the current one.
- Theme controls basics: background opacity and accent color.
- Frontend decomposition start: extracted keyboard layout and key-mapping helpers into `frontend/src/keyboard.js`.
