# Code Typer

Offline desktop typing trainer for programmers, built with Go, Wails, and a vanilla JavaScript frontend.

The goal is not to teach algorithms. The goal is to make code syntax feel automatic: braces, tabs, returns, map access, channels, loops, function signatures, and common snippets should become muscle memory.

## Current Features

- Desktop app powered by Wails.
- Offline exercise list with Go, JavaScript, and Python snippets.
- Physical QWERTY key handling, so typing works even when the OS input language is not English.
- Code-editor style typing surface with line numbers.
- Current speed, accuracy, typo count, and progress bar.
- Keyboard hints for expected keys, pressed keys, service keys, and mistakes.
- Completion heatmap based on all mistakes made during the exercise, including mistakes fixed with Backspace.
- Settings for speed unit, tab width, input mode, keyboard hints, generated sounds, background opacity, and accent color.

## Product Direction

Code Typer is intended to stay minimal and offline-first.

Planned work lives in:

- `ROADMAP.md`
- `ROADMAP_RUS.md`

Russian README:

- `README_RUS.md`

Near-term direction:

- Persistent session statistics and charts.
- Exercise pools and topic-focused snippet packs.
- Flexible tab input: accept either a real Tab or configured spaces where appropriate.
- Typed-buffer model for more IDE-like handling of wrong characters before newlines.
- Custom sounds, theme presets, syntax highlighting, and user snippet imports.

## Development

Requirements:

- Go
- Node.js and npm
- Wails v2 CLI

Install frontend dependencies:

```sh
cd frontend
npm install
```

Run the app in development mode:

```sh
wails dev
```

Wails also exposes a browser development target, usually:

```txt
http://localhost:34115
```

Use that URL when you need browser devtools while still calling bound Go methods.

## Build

Build the desktop app:

```sh
wails build
```

On macOS the binary is produced under:

```txt
build/bin/code-typer.app
```

## Verification

Useful checks before committing:

```sh
cd frontend
npm run build
```

```sh
go test ./...
```

```sh
wails build
```

If Go embed cache complains about an old Vite asset hash after a frontend build, rerun `go test` with a fresh `GOCACHE` or run it after the frontend build has fully finished.
