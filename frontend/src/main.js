import './style.css';
import {
    Backspace,
    GetSession,
    HandleInput,
    ListExercises,
    StartExercise,
} from "../wailsjs/go/main/App";

const keyboardLayout = [
    [
        key("`", "`", ["`", "~"]),
        key("1", "1", ["1", "!"]),
        key("2", "2", ["2", "@"]),
        key("3", "3", ["3", "#"]),
        key("4", "4", ["4", "$"]),
        key("5", "5", ["5", "%"]),
        key("6", "6", ["6", "^"]),
        key("7", "7", ["7", "&"]),
        key("8", "8", ["8", "*"]),
        key("9", "9", ["9", "("]),
        key("0", "0", ["0", ")"]),
        key("-", "-", ["-", "_"]),
        key("=", "=", ["=", "+"]),
        key("backspace", "delete", [], 1.65),
    ],
    [
        key("tab", "tab", [], 1.5),
        key("q", "Q", ["q", "Q"]),
        key("w", "W", ["w", "W"]),
        key("e", "E", ["e", "E"]),
        key("r", "R", ["r", "R"]),
        key("t", "T", ["t", "T"]),
        key("y", "Y", ["y", "Y"]),
        key("u", "U", ["u", "U"]),
        key("i", "I", ["i", "I"]),
        key("o", "O", ["o", "O"]),
        key("p", "P", ["p", "P"]),
        key("[", "[", ["[", "{"]),
        key("]", "]", ["]", "}"]),
        key("\\", "\\", ["\\", "|"]),
    ],
    [
        key("caps", "caps", [], 1.75),
        key("a", "A", ["a", "A"]),
        key("s", "S", ["s", "S"]),
        key("d", "D", ["d", "D"]),
        key("f", "F", ["f", "F"]),
        key("g", "G", ["g", "G"]),
        key("h", "H", ["h", "H"]),
        key("j", "J", ["j", "J"]),
        key("k", "K", ["k", "K"]),
        key("l", "L", ["l", "L"]),
        key(";", ";", [";", ":"]),
        key("'", "'", ["'", "\""]),
        key("enter", "enter", [], 1.85),
    ],
    [
        key("shift-left", "shift", [], 2.2),
        key("z", "Z", ["z", "Z"]),
        key("x", "X", ["x", "X"]),
        key("c", "C", ["c", "C"]),
        key("v", "V", ["v", "V"]),
        key("b", "B", ["b", "B"]),
        key("n", "N", ["n", "N"]),
        key("m", "M", ["m", "M"]),
        key(",", ",", [",", "<"]),
        key(".", ".", [".", ">"]),
        key("/", "/", ["/", "?"]),
        key("shift-right", "shift", [], 2.35),
    ],
    [
        key("control", "control", [], 1.15),
        key("option", "option", [], 1.15),
        key("command-left", "command", [], 1.35),
        key("space", "", [" "], 5.4),
        key("command-right", "command", [], 1.35),
        key("option-right", "option", [], 1.15),
    ],
];

const shiftMap = {
    "~": "`",
    "!": "1",
    "@": "2",
    "#": "3",
    "$": "4",
    "%": "5",
    "^": "6",
    "&": "7",
    "*": "8",
    "(": "9",
    ")": "0",
    "_": "-",
    "+": "=",
    "{": "[",
    "}": "]",
    "|": "\\",
    ":": ";",
    "\"": "'",
    "<": ",",
    ">": ".",
    "?": "/",
};

const physicalPunctuation = {
    Backquote: ["`", "~"],
    Digit1: ["1", "!"],
    Digit2: ["2", "@"],
    Digit3: ["3", "#"],
    Digit4: ["4", "$"],
    Digit5: ["5", "%"],
    Digit6: ["6", "^"],
    Digit7: ["7", "&"],
    Digit8: ["8", "*"],
    Digit9: ["9", "("],
    Digit0: ["0", ")"],
    Minus: ["-", "_"],
    Equal: ["=", "+"],
    BracketLeft: ["[", "{"],
    BracketRight: ["]", "}"],
    Backslash: ["\\", "|"],
    Semicolon: [";", ":"],
    Quote: ["'", "\""],
    Comma: [",", "<"],
    Period: [".", ">"],
    Slash: ["/", "?"],
};

const keyIdByCode = {
    Backquote: "`",
    Digit1: "1",
    Digit2: "2",
    Digit3: "3",
    Digit4: "4",
    Digit5: "5",
    Digit6: "6",
    Digit7: "7",
    Digit8: "8",
    Digit9: "9",
    Digit0: "0",
    Minus: "-",
    Equal: "=",
    Backspace: "backspace",
    Tab: "tab",
    KeyQ: "q",
    KeyW: "w",
    KeyE: "e",
    KeyR: "r",
    KeyT: "t",
    KeyY: "y",
    KeyU: "u",
    KeyI: "i",
    KeyO: "o",
    KeyP: "p",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    KeyA: "a",
    KeyS: "s",
    KeyD: "d",
    KeyF: "f",
    KeyG: "g",
    KeyH: "h",
    KeyJ: "j",
    KeyK: "k",
    KeyL: "l",
    Semicolon: ";",
    Quote: "'",
    Enter: "enter",
    KeyZ: "z",
    KeyX: "x",
    KeyC: "c",
    KeyV: "v",
    KeyB: "b",
    KeyN: "n",
    KeyM: "m",
    Comma: ",",
    Period: ".",
    Slash: "/",
    Space: "space",
};

const leftHandKeys = new Set(["`", "1", "2", "3", "4", "5", "q", "w", "e", "r", "t", "a", "s", "d", "f", "g", "z", "x", "c", "v", "b"]);
const heatmapExcludedKeys = new Set(["backspace", "caps", "enter", "shift-left", "shift-right", "control", "option", "option-right", "command-left", "command-right"]);
const closingPairByOpen = {
    "(": ")",
    "[": "]",
    "{": "}",
    "\"": "\"",
    "'": "'",
};

const settingsStorageKey = "codeTyper.settings.v1";
const lastResultStorageKey = "codeTyper.lastResult.v1";

const defaultSettings = {
    layout: "qwerty",
    speedUnit: "cpm",
    indentationSize: 4,
    backgroundOpacity: 58,
    accentColor: "#57a6ff",
    inputMode: "notebook",
    showHints: true,
    errorSoundEnabled: true,
    keypressSoundEnabled: false,
};

const state = {
    exercises: [],
    selectedLanguage: "",
    selectedExerciseId: "",
    session: null,
    queue: Promise.resolve(),
    refreshing: false,
    pressedKeys: new Set(),
    errorKeys: new Set(),
    heldKeys: new Set(),
    keyFeedbackTimers: new Map(),
    settings: loadSettings(),
    lastResult: loadLastResult(),
    mistakeKeys: new Map(),
    completion: null,
    completionSignature: "",
    audioContext: null,
};

document.body.innerHTML = `
<main class="app-shell">
    <header class="top-bar">
        <div></div>
        <div class="metrics" aria-label="Current exercise metrics">
            <div class="metric">
                <span class="metric-value" id="speedValue">0</span>
                <span class="metric-label" id="speedLabel">char/min</span>
            </div>
            <div class="metric">
                <span class="metric-value" id="accuracyValue">100%</span>
                <span class="metric-label">accuracy</span>
            </div>
            <div class="metric">
                <span class="metric-value" id="typosValue">0</span>
                <span class="metric-label">typos</span>
            </div>
        </div>
        <div class="window-actions">
            <button class="icon-button" id="settingsButton" type="button" aria-label="Settings" title="Settings">&#9881;</button>
        </div>
    </header>

    <section class="workspace">
        <div class="editor-bar">
            <div class="selectors">
                <label>
                    <span>Language</span>
                    <select id="languageSelect"></select>
                </label>
                <label>
                    <span>Exercise</span>
                    <select id="exerciseSelect"></select>
                </label>
            </div>
            <button class="text-button" id="restartButton" type="button">Restart (Cmd+R)</button>
        </div>

        <div class="editor-shell">
            <div class="progress-track">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="code-editor" id="codeEditor" tabindex="0" aria-label="Typing exercise"></div>
        </div>

        <section class="completion-panel" id="completionPanel" hidden></section>

        <div class="keyboard" id="keyboard" aria-hidden="true"></div>
    </section>

    <div class="settings-modal" id="settingsModal" hidden>
        <section class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
            <div class="settings-panel-header">
                <h2 id="settingsTitle">Settings</h2>
                <button class="icon-button compact" id="closeSettingsButton" type="button" aria-label="Close settings" title="Close">&times;</button>
            </div>

            <div class="settings-grid">
                <label class="setting-field">
                    <span>Layout</span>
                    <select id="layoutSelect">
                        <option value="qwerty">QWERTY</option>
                    </select>
                </label>
                <label class="setting-field">
                    <span>Speed</span>
                    <select id="speedUnitSelect">
                        <option value="cpm">Characters per minute</option>
                        <option value="wpm">Words per minute</option>
                    </select>
                </label>
                <label class="setting-field">
                    <span>Tab width</span>
                    <select id="indentationSizeSelect">
                        <option value="2">2 spaces</option>
                        <option value="4">4 spaces</option>
                    </select>
                </label>
                <label class="setting-field">
                    <span class="setting-field-row">
                        <span>Background opacity</span>
                        <span id="backgroundOpacityValue">58%</span>
                    </span>
                    <input id="backgroundOpacityInput" type="range" min="40" max="85" step="1">
                </label>
                <label class="setting-field">
                    <span>Accent color</span>
                    <input class="color-input" id="accentColorInput" type="color">
                </label>
                <label class="setting-field">
                    <span>Input mode</span>
                    <select id="inputModeSelect">
                        <option value="notebook">Notebook</option>
                        <option value="ide">IDE auto-pairs</option>
                    </select>
                </label>
                <label class="setting-toggle">
                    <input id="showHintsInput" type="checkbox">
                    <span>Show keyboard hints</span>
                </label>
                <label class="setting-toggle">
                    <input id="errorSoundInput" type="checkbox">
                    <span>Error sound</span>
                </label>
                <label class="setting-toggle">
                    <input id="keypressSoundInput" type="checkbox">
                    <span>Keypress sound</span>
                </label>
            </div>
        </section>
    </div>
</main>
`;

const elements = {
    speedValue: document.getElementById("speedValue"),
    speedLabel: document.getElementById("speedLabel"),
    accuracyValue: document.getElementById("accuracyValue"),
    typosValue: document.getElementById("typosValue"),
    languageSelect: document.getElementById("languageSelect"),
    exerciseSelect: document.getElementById("exerciseSelect"),
    restartButton: document.getElementById("restartButton"),
    settingsButton: document.getElementById("settingsButton"),
    settingsModal: document.getElementById("settingsModal"),
    closeSettingsButton: document.getElementById("closeSettingsButton"),
    layoutSelect: document.getElementById("layoutSelect"),
    speedUnitSelect: document.getElementById("speedUnitSelect"),
    indentationSizeSelect: document.getElementById("indentationSizeSelect"),
    backgroundOpacityInput: document.getElementById("backgroundOpacityInput"),
    backgroundOpacityValue: document.getElementById("backgroundOpacityValue"),
    accentColorInput: document.getElementById("accentColorInput"),
    inputModeSelect: document.getElementById("inputModeSelect"),
    showHintsInput: document.getElementById("showHintsInput"),
    errorSoundInput: document.getElementById("errorSoundInput"),
    keypressSoundInput: document.getElementById("keypressSoundInput"),
    progressFill: document.getElementById("progressFill"),
    completionPanel: document.getElementById("completionPanel"),
    codeEditor: document.getElementById("codeEditor"),
    keyboard: document.getElementById("keyboard"),
};

init();

async function init() {
    elements.codeEditor.textContent = "Loading...";

    state.exercises = await ListExercises();
    const firstExercise = state.exercises[0];
    state.selectedLanguage = firstExercise.language;
    state.selectedExerciseId = firstExercise.id;

    renderLanguageOptions();
    renderExerciseOptions();
    renderSettingsForm();
    applySettings();
    renderKeyboard("");

    state.session = await StartExercise(state.selectedExerciseId);
    render();
    bindEvents();
    window.setInterval(refreshSessionStats, 1000);
}

function bindEvents() {
    elements.languageSelect.addEventListener("change", async (event) => {
        state.selectedLanguage = event.target.value;
        const nextExercise = filteredExercises()[0];
        if (!nextExercise) {
            return;
        }
        state.selectedExerciseId = nextExercise.id;
        renderExerciseOptions();
        await startSelectedExercise();
    });

    elements.exerciseSelect.addEventListener("change", async (event) => {
        state.selectedExerciseId = event.target.value;
        await startSelectedExercise();
    });

    elements.restartButton.addEventListener("click", startSelectedExercise);
    elements.codeEditor.addEventListener("click", () => elements.codeEditor.focus());
    elements.settingsButton.addEventListener("click", openSettings);
    elements.closeSettingsButton.addEventListener("click", closeSettings);
    elements.settingsModal.addEventListener("click", (event) => {
        if (event.target === elements.settingsModal) {
            closeSettings();
        }
    });
    elements.layoutSelect.addEventListener("change", handleSettingsChange);
    elements.speedUnitSelect.addEventListener("change", handleSettingsChange);
    elements.indentationSizeSelect.addEventListener("change", handleSettingsChange);
    elements.backgroundOpacityInput.addEventListener("input", handleSettingsChange);
    elements.accentColorInput.addEventListener("input", handleSettingsChange);
    elements.inputModeSelect.addEventListener("change", handleSettingsChange);
    elements.showHintsInput.addEventListener("change", handleSettingsChange);
    elements.errorSoundInput.addEventListener("change", handleSettingsChange);
    elements.keypressSoundInput.addEventListener("change", handleSettingsChange);

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !elements.settingsModal.hidden) {
            event.preventDefault();
            closeSettings();
            return;
        }

        if (!elements.settingsModal.hidden) {
            return;
        }

        if (isRestartShortcut(event)) {
            event.preventDefault();
            state.queue = state.queue.then(() => restartCurrentExercise(["command-left", "r"]));
            return;
        }

        const serviceKeyId = serviceKeyIdForEvent(event);
        if (serviceKeyId) {
            state.heldKeys.add(serviceKeyId);
            renderKeyboard(currentKeyboardExpected(), completionHeatmap());
        }

        const action = normalizeKey(event);
        if (!action) {
            return;
        }

        action.keyIds = keyIdsForEvent(event);
        event.preventDefault();
        state.queue = state.queue.then(() => applyInput(action));
    });

    window.addEventListener("keyup", (event) => {
        const serviceKeyId = serviceKeyIdForEvent(event);
        if (!serviceKeyId) {
            return;
        }
        state.heldKeys.delete(serviceKeyId);
        renderKeyboard(currentKeyboardExpected(), completionHeatmap());
    });

    window.addEventListener("blur", () => {
        state.heldKeys.clear();
        renderKeyboard(currentKeyboardExpected(), completionHeatmap());
    });
}

async function startSelectedExercise() {
    state.completion = null;
    state.completionSignature = "";
    state.mistakeKeys = new Map();
    state.session = await StartExercise(state.selectedExerciseId);
    render();
    elements.codeEditor.focus();
}

async function startRandomExerciseFromActivePool() {
    const pool = filteredExercises();
    if (pool.length === 0) {
        await startSelectedExercise();
        return;
    }

    const candidates = pool.length > 1
        ? pool.filter((exercise) => exercise.id !== state.selectedExerciseId)
        : pool;
    const nextExercise = candidates[Math.floor(Math.random() * candidates.length)];

    state.selectedExerciseId = nextExercise.id;
    renderExerciseOptions();
    await startSelectedExercise();
}

async function applyInput(action) {
    if (state.session?.stats.complete) {
        if (action.type === "input" && action.source === "enter") {
            flashKeys(action.keyIds, "pressed");
            await startRandomExerciseFromActivePool();
        }
        return;
    }

    const previousIndex = state.session?.stats.index ?? 0;

    if (action.type === "backspace") {
        state.session = await Backspace();
        flashKeys(action.keyIds, "pressed");
    } else {
        const input = inputForAction(action);
        state.session = await HandleInput(input);
        const mistakeKeyIds = mistakeKeysForInput(previousIndex, input.length);
        recordMistakeKeys(mistakeKeyIds);
        flashKeys(action.keyIds, mistakeKeyIds.length > 0 ? "error" : "pressed");
        playInputSound(previousIndex);
    }
    render();
}

async function refreshSessionStats() {
    if (state.refreshing || !state.session) {
        return;
    }
    if (state.session.stats.typedCount === 0 || state.session.stats.complete) {
        return;
    }

    state.refreshing = true;
    state.queue = state.queue.then(async () => {
        try {
            if (!state.session || state.session.stats.typedCount === 0 || state.session.stats.complete) {
                return;
            }
            state.session = await GetSession();
            renderMetrics();
        } finally {
            state.refreshing = false;
        }
    });
}

function normalizeKey(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) {
        return null;
    }

    if (event.code === "Backspace") {
        return { type: "backspace" };
    }
    if (event.code === "Enter") {
        return { type: "input", value: "\n", source: "enter" };
    }
    if (event.code === "Tab") {
        return { type: "input", value: "\t", source: "tab" };
    }

    const physicalChar = physicalCodeToChar(event);
    if (physicalChar) {
        return { type: "input", value: physicalChar, source: "key" };
    }

    return null;
}

function physicalCodeToChar(event) {
    if (/^Key[A-Z]$/.test(event.code)) {
        const letter = event.code.slice(3).toLowerCase();
        const capsLock = event.getModifierState && event.getModifierState("CapsLock");
        return event.shiftKey !== Boolean(capsLock) ? letter.toUpperCase() : letter;
    }

    const pair = physicalPunctuation[event.code];
    if (pair) {
        return event.shiftKey ? pair[1] : pair[0];
    }

    if (event.code === "Space") {
        return " ";
    }

    return "";
}

function keyIdsForEvent(event) {
    const keyId = keyIdByCode[event.code];
    if (!keyId) {
        return [];
    }

    const keys = [keyId];
    const shiftedChar = physicalCodeToChar(event);
    const needsShift = Boolean(event.shiftKey && shiftedChar && shiftedChar !== shiftedChar.toLowerCase())
        || Boolean(event.shiftKey && shiftMap[shiftedChar]);

    if (needsShift) {
        keys.push(shiftKeyFor(keyId));
    }

    return keys;
}

function inputForAction(action) {
    if (!state.session?.expected) {
        return action.value;
    }

    if (state.settings.inputMode !== "ide") {
        return action.value;
    }

    const expected = state.session.expected;
    const closingPair = closingPairByOpen[action.value];
    const nextChar = state.session.render[state.session.stats.index + 1]?.char;
    if (!closingPair || expected !== action.value || nextChar !== closingPair) {
        return action.value;
    }

    return action.value + closingPair;
}

function isRestartShortcut(event) {
    return event.metaKey && event.code === "KeyR" && !event.ctrlKey && !event.altKey;
}

async function restartCurrentExercise(keyIds = []) {
    flashKeys(keyIds, "pressed");
    await startSelectedExercise();
}

function mistakeKeysForInput(index, length) {
    return state.session.render
        .slice(index, index + length)
        .filter((char) => char.state === "incorrect")
        .flatMap((char) => keyIdsForChar(char.char))
        .filter((keyId) => !heatmapExcludedKeys.has(keyId));
}

function recordMistakeKeys(keyIds) {
    keyIds.forEach((keyId) => {
        state.mistakeKeys.set(keyId, (state.mistakeKeys.get(keyId) ?? 0) + 1);
    });
}

function render() {
    if (!state.session) {
        return;
    }

    renderMetrics();
    renderCode();
    renderCompletion();
    renderKeyboard(state.session.stats.complete ? "\n" : state.session.expected, completionHeatmap());
}

function renderMetrics() {
    const stats = state.session.stats;
    const speed = speedForCurrentUnit(stats.speedCpm);
    elements.speedValue.textContent = speed.value;
    elements.speedLabel.textContent = speed.label;
    elements.accuracyValue.textContent = `${stats.accuracy}%`;
    elements.typosValue.textContent = stats.typos;
    elements.progressFill.style.width = `${Math.max(0, Math.min(1, stats.progress)) * 100}%`;
}

function renderCompletion() {
    if (!state.session.stats.complete) {
        elements.completionPanel.hidden = true;
        elements.completionPanel.innerHTML = "";
        return;
    }

    currentCompletion();
    elements.completionPanel.hidden = true;
    elements.completionPanel.textContent = "";
}

function currentCompletion() {
    const stats = state.session.stats;
    const signature = [
        state.selectedExerciseId,
        stats.elapsedMs,
        stats.typedCount,
        stats.correctCount,
        stats.typos,
    ].join(":");

    if (state.completionSignature === signature && state.completion) {
        return state.completion;
    }

    const current = {
        exerciseId: state.selectedExerciseId,
        language: state.selectedLanguage,
        speedCpm: stats.speedCpm,
        accuracy: stats.accuracy,
        typos: stats.typos,
        completedAt: new Date().toISOString(),
    };
    const previous = state.lastResult;
    const delta = {
        speedCpm: previous ? current.speedCpm - previous.speedCpm : null,
        accuracy: previous ? current.accuracy - previous.accuracy : null,
        typos: previous ? current.typos - previous.typos : null,
    };

    state.completion = { current, previous, delta };
    state.completionSignature = signature;
    state.lastResult = current;
    saveLastResult(current);

    return state.completion;
}

function renderCode() {
    const lines = [[]];

    state.session.render.forEach((char, index) => {
        const item = { ...char, index, newline: char.char === "\n" };
        lines[lines.length - 1].push(item);
        if (item.newline) {
            lines.push([]);
        }
    });

    elements.codeEditor.innerHTML = "";

    lines.forEach((line, lineIndex) => {
        const row = document.createElement("div");
        row.className = "code-row";

        const gutter = document.createElement("div");
        gutter.className = "line-number";
        gutter.textContent = String(lineIndex + 1).padStart(2, " ");

        const codeLine = document.createElement("div");
        codeLine.className = "code-line";

        line.forEach((item) => {
            const span = document.createElement("span");
            span.className = `code-char ${item.state}`;
            if (item.index === state.session.stats.index) {
                span.classList.add("cursor");
            }
            if (item.char === "\t") {
                span.classList.add("tab-char");
                span.textContent = "\t";
            } else if (item.char === " ") {
                span.classList.add("space-char");
                span.textContent = " ";
            } else if (item.newline) {
                span.classList.add("newline-char");
                span.textContent = " ";
            } else {
                span.textContent = item.char;
            }
            codeLine.appendChild(span);
        });

        if (state.session.stats.index === state.session.render.length && lineIndex === lines.length - 1) {
            const cursor = document.createElement("span");
            cursor.className = "tail-cursor";
            codeLine.appendChild(cursor);
        }

        row.append(gutter, codeLine);
        elements.codeEditor.appendChild(row);
    });

    requestAnimationFrame(keepCursorVisible);
}

function keepCursorVisible() {
    const cursor = elements.codeEditor.querySelector(".code-char.cursor, .tail-cursor");
    if (!cursor) {
        return;
    }

    const editorRect = elements.codeEditor.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();
    const margin = 72;

    if (cursorRect.bottom > editorRect.bottom - margin) {
        elements.codeEditor.scrollTop += cursorRect.bottom - editorRect.bottom + margin;
    } else if (cursorRect.top < editorRect.top + margin) {
        elements.codeEditor.scrollTop -= editorRect.top + margin - cursorRect.top;
    }
}

function renderLanguageOptions() {
    const languages = [...new Set(state.exercises.map((exercise) => exercise.language))];
    elements.languageSelect.innerHTML = "";

    languages.forEach((language) => {
        const option = document.createElement("option");
        option.value = language;
        option.textContent = language;
        option.selected = language === state.selectedLanguage;
        elements.languageSelect.appendChild(option);
    });
}

function renderExerciseOptions() {
    elements.exerciseSelect.innerHTML = "";

    filteredExercises().forEach((exercise) => {
        const option = document.createElement("option");
        option.value = exercise.id;
        option.textContent = `${exercise.title} - ${exercise.difficulty}`;
        option.selected = exercise.id === state.selectedExerciseId;
        elements.exerciseSelect.appendChild(option);
    });
}

function filteredExercises() {
    return state.exercises.filter((exercise) => exercise.language === state.selectedLanguage);
}

function renderKeyboard(expected, heatmap = new Map()) {
    const activeKeys = expectedKeys(expected);
    const maxHeat = Math.max(0, ...heatmap.values());
    elements.keyboard.innerHTML = "";

    keyboardLayout.forEach((row) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";

        row.forEach((item) => {
            const keyEl = document.createElement("div");
            keyEl.className = "keyboard-key";
            keyEl.style.flex = String(item.width);
            keyEl.textContent = item.label;
            const heat = heatmap.get(item.id) ?? 0;
            if (heat > 0 && maxHeat > 0) {
                keyEl.classList.add(`heat-${Math.max(1, Math.min(4, Math.ceil((heat / maxHeat) * 4)))}`);
            }
            if (activeKeys.has(item.id)) {
                keyEl.classList.add("expected");
            }
            if (state.pressedKeys.has(item.id)) {
                keyEl.classList.add("pressed");
            }
            if (state.errorKeys.has(item.id)) {
                keyEl.classList.add("error");
            }
            if (state.heldKeys.has(item.id)) {
                keyEl.classList.add("held");
            }
            rowEl.appendChild(keyEl);
        });

        elements.keyboard.appendChild(rowEl);
    });
}

function expectedKeys(expected) {
    const keys = new Set();
    if (!expected) {
        return keys;
    }

    if (expected === "\n") {
        keys.add("enter");
        return keys;
    }
    if (expected === "\t") {
        keys.add("tab");
        return keys;
    }
    if (expected === " ") {
        keys.add("space");
        return keys;
    }

    if (/[A-Z]/.test(expected)) {
        const baseKey = expected.toLowerCase();
        keys.add(shiftKeyFor(baseKey));
        keys.add(baseKey);
        return keys;
    }

    if (shiftMap[expected]) {
        const baseKey = shiftMap[expected];
        keys.add(shiftKeyFor(baseKey));
        keys.add(baseKey);
        return keys;
    }

    keys.add(expected.toLowerCase());
    return keys;
}

function completionHeatmap() {
    if (!state.session?.stats.complete) {
        return new Map();
    }
    return new Map(state.mistakeKeys);
}

function keyIdsForChar(char) {
    if (char === "\n") {
        return ["enter"];
    }
    if (char === "\t") {
        return ["tab"];
    }
    if (char === " ") {
        return ["space"];
    }
    if (/[A-Z]/.test(char)) {
        return [shiftKeyFor(char.toLowerCase()), char.toLowerCase()];
    }
    if (shiftMap[char]) {
        const baseKey = shiftMap[char];
        return [shiftKeyFor(baseKey), baseKey];
    }
    return [char.toLowerCase()];
}

function key(id, label, chars = [], width = 1, group = id) {
    return { id, label, chars, width, group };
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(settingsStorageKey);
        if (!saved) {
            return { ...defaultSettings };
        }
        return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
        return { ...defaultSettings };
    }
}

function loadLastResult() {
    try {
        const saved = localStorage.getItem(lastResultStorageKey);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function saveLastResult(result) {
    localStorage.setItem(lastResultStorageKey, JSON.stringify(result));
}

function saveSettings() {
    localStorage.setItem(settingsStorageKey, JSON.stringify(state.settings));
}

function renderSettingsForm() {
    elements.layoutSelect.value = state.settings.layout;
    elements.speedUnitSelect.value = state.settings.speedUnit;
    elements.indentationSizeSelect.value = String(state.settings.indentationSize);
    elements.backgroundOpacityInput.value = String(normalizedBackgroundOpacity());
    elements.backgroundOpacityValue.textContent = `${normalizedBackgroundOpacity()}%`;
    elements.accentColorInput.value = normalizedAccentColor();
    elements.inputModeSelect.value = state.settings.inputMode;
    elements.showHintsInput.checked = state.settings.showHints;
    elements.errorSoundInput.checked = state.settings.errorSoundEnabled;
    elements.keypressSoundInput.checked = state.settings.keypressSoundEnabled;
}

function handleSettingsChange() {
    state.settings = {
        layout: elements.layoutSelect.value,
        speedUnit: elements.speedUnitSelect.value,
        indentationSize: Number(elements.indentationSizeSelect.value),
        backgroundOpacity: Number(elements.backgroundOpacityInput.value),
        accentColor: elements.accentColorInput.value,
        inputMode: elements.inputModeSelect.value,
        showHints: elements.showHintsInput.checked,
        errorSoundEnabled: elements.errorSoundInput.checked,
        keypressSoundEnabled: elements.keypressSoundInput.checked,
    };
    saveSettings();
    applySettings();
}

function applySettings() {
    document.body.classList.toggle("hide-hints", !state.settings.showHints);
    document.documentElement.style.setProperty("--indent-size", state.settings.indentationSize);
    applyBackgroundOpacity();
    applyAccentColor();
    if (state.session) {
        renderMetrics();
    }
}

function applyBackgroundOpacity() {
    const opacityPercent = normalizedBackgroundOpacity();
    const opacity = opacityPercent / 100;
    const root = document.documentElement;

    elements.backgroundOpacityValue.textContent = `${opacityPercent}%`;
    root.style.setProperty("--app-bg-opacity", opacity.toFixed(2));
    root.style.setProperty("--app-warm-opacity", (opacity * 0.5).toFixed(2));
    root.style.setProperty("--app-mid-opacity", (opacity * 0.75).toFixed(2));
    root.style.setProperty("--app-cool-opacity", (opacity * 0.9).toFixed(2));
}

function applyAccentColor() {
    const color = normalizedAccentColor();
    const rgb = hexToRgb(color);
    const strong = mixRgb(rgb, { r: 20, g: 35, b: 55 }, 0.24);
    const root = document.documentElement;

    root.style.setProperty("--accent", color);
    root.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty("--accent-strong", rgbToHex(strong));
}

function openSettings() {
    elements.settingsModal.hidden = false;
    elements.speedUnitSelect.focus();
}

function closeSettings() {
    elements.settingsModal.hidden = true;
    elements.codeEditor.focus();
}

function speedForCurrentUnit(speedCpm) {
    if (state.settings.speedUnit === "wpm") {
        return {
            value: Math.round(speedCpm / 5),
            label: "words/min",
        };
    }
    return {
        value: speedCpm,
        label: "char/min",
    };
}

function normalizedBackgroundOpacity() {
    const value = Number(state.settings.backgroundOpacity);
    if (!Number.isFinite(value)) {
        return defaultSettings.backgroundOpacity;
    }
    return Math.max(40, Math.min(85, value));
}

function normalizedAccentColor() {
    const value = String(state.settings.accentColor ?? defaultSettings.accentColor);
    return /^#[0-9a-f]{6}$/i.test(value) ? value : defaultSettings.accentColor;
}

function hexToRgb(hex) {
    const value = hex.replace("#", "");
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
    };
}

function mixRgb(color, target, amount) {
    return {
        r: Math.round(color.r + (target.r - color.r) * amount),
        g: Math.round(color.g + (target.g - color.g) * amount),
        b: Math.round(color.b + (target.b - color.b) * amount),
    };
}

function rgbToHex(color) {
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function toHex(value) {
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
}

function shiftKeyFor(baseKey) {
    return leftHandKeys.has(baseKey) ? "shift-right" : "shift-left";
}

function serviceKeyIdForEvent(event) {
    if (event.code === "ShiftLeft") {
        return "shift-left";
    }
    if (event.code === "ShiftRight") {
        return "shift-right";
    }
    if (event.code === "ControlLeft" || event.code === "ControlRight") {
        return "control";
    }
    if (event.code === "AltLeft") {
        return "option";
    }
    if (event.code === "AltRight") {
        return "option-right";
    }
    if (event.code === "MetaLeft") {
        return "command-left";
    }
    if (event.code === "MetaRight") {
        return "command-right";
    }
    return "";
}

function flashKeys(keyIds, kind) {
    if (!keyIds?.length) {
        return;
    }

    const target = kind === "error" ? state.errorKeys : state.pressedKeys;
    const duration = kind === "error" ? 360 : 130;

    keyIds.forEach((keyId) => {
        const timerId = `${kind}:${keyId}`;
        window.clearTimeout(state.keyFeedbackTimers.get(timerId));
        target.add(keyId);

        state.keyFeedbackTimers.set(timerId, window.setTimeout(() => {
            target.delete(keyId);
            state.keyFeedbackTimers.delete(timerId);
            renderKeyboard(currentKeyboardExpected(), completionHeatmap());
        }, duration));
    });

    renderKeyboard(currentKeyboardExpected(), completionHeatmap());
}

function currentKeyboardExpected() {
    if (!state.session) {
        return "";
    }
    return state.session.stats.complete ? "\n" : state.session.expected;
}

function playInputSound(index) {
    const char = state.session?.render[index];
    if (!char) {
        return;
    }

    if (char.state === "incorrect") {
        if (state.settings.errorSoundEnabled) {
            playClickSound("error");
        }
        return;
    }

    if (state.settings.keypressSoundEnabled) {
        playClickSound("key");
    }
}

function playClickSound(kind) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return;
    }

    if (!state.audioContext) {
        state.audioContext = new AudioContextClass();
    }

    const context = state.audioContext;
    if (context.state === "suspended") {
        context.resume();
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();

    oscillator.type = kind === "error" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(kind === "error" ? 135 : 880, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "error" ? 84 : 520, now + 0.055);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(kind === "error" ? 900 : 1800, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "error" ? 0.08 : 0.025, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.08);
}
