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
        key("shift-left", "shift", [], 2.2, "shift"),
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
        key("shift-right", "shift", [], 2.35, "shift"),
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

const state = {
    exercises: [],
    selectedLanguage: "",
    selectedExerciseId: "",
    session: null,
    queue: Promise.resolve(),
    refreshing: false,
};

document.body.innerHTML = `
<main class="app-shell">
    <header class="top-bar">
        <div class="brand">
            <span class="brand-mark"></span>
            <span>Code Typer</span>
        </div>
        <div class="metrics" aria-label="Current exercise metrics">
            <div class="metric">
                <span class="metric-value" id="speedValue">0</span>
                <span class="metric-label">char/min</span>
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
            <button class="text-button" id="restartButton" type="button">Restart</button>
        </div>

        <div class="editor-shell">
            <div class="progress-track">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="code-editor" id="codeEditor" tabindex="0" aria-label="Typing exercise"></div>
        </div>

        <div class="keyboard" id="keyboard" aria-hidden="true"></div>
    </section>
</main>
`;

const elements = {
    speedValue: document.getElementById("speedValue"),
    accuracyValue: document.getElementById("accuracyValue"),
    typosValue: document.getElementById("typosValue"),
    languageSelect: document.getElementById("languageSelect"),
    exerciseSelect: document.getElementById("exerciseSelect"),
    restartButton: document.getElementById("restartButton"),
    progressFill: document.getElementById("progressFill"),
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

    window.addEventListener("keydown", (event) => {
        const action = normalizeKey(event);
        if (!action) {
            return;
        }

        event.preventDefault();
        state.queue = state.queue.then(() => applyInput(action));
    });
}

async function startSelectedExercise() {
    state.session = await StartExercise(state.selectedExerciseId);
    render();
    elements.codeEditor.focus();
}

async function applyInput(action) {
    if (action.type === "backspace") {
        state.session = await Backspace();
    } else {
        state.session = await HandleInput(action.value);
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
        return { type: "input", value: "\n" };
    }
    if (event.code === "Tab") {
        return { type: "input", value: "\t" };
    }

    const physicalChar = physicalCodeToChar(event);
    if (physicalChar) {
        return { type: "input", value: physicalChar };
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

function render() {
    if (!state.session) {
        return;
    }

    renderMetrics();
    renderCode();
    renderKeyboard(state.session.expected);
}

function renderMetrics() {
    const stats = state.session.stats;
    elements.speedValue.textContent = stats.speedCpm;
    elements.accuracyValue.textContent = `${stats.accuracy}%`;
    elements.typosValue.textContent = stats.typos;
    elements.progressFill.style.width = `${Math.max(0, Math.min(1, stats.progress)) * 100}%`;
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

function renderKeyboard(expected) {
    const activeKeys = expectedKeys(expected);
    elements.keyboard.innerHTML = "";

    keyboardLayout.forEach((row) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";

        row.forEach((item) => {
            const keyEl = document.createElement("div");
            keyEl.className = "keyboard-key";
            keyEl.style.flex = String(item.width);
            keyEl.textContent = item.label;
            if (activeKeys.has(item.id) || activeKeys.has(item.group)) {
                keyEl.classList.add("active");
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
        keys.add("shift");
        keys.add(expected.toLowerCase());
        return keys;
    }

    if (shiftMap[expected]) {
        keys.add("shift");
        keys.add(shiftMap[expected]);
        return keys;
    }

    keys.add(expected.toLowerCase());
    return keys;
}

function key(id, label, chars = [], width = 1, group = id) {
    return { id, label, chars, width, group };
}
