import './style.css';
import { playClickSound } from "./audio";
import {
    expectedKeys,
    heatmapExcludedKeys,
    keyboardLayout,
    keyIdsForChar,
    keyIdsForEvent,
    serviceKeyIdForEvent,
} from "./keyboard";
import {
    applySettingsToDocument,
    loadSettings,
    readSettingsForm,
    renderSettingsForm as renderSettingsFields,
    saveSettings,
} from "./settings";
import { inputForAction, isRestartShortcut, normalizeKey } from "./typing";
import {
    Backspace,
    GetSession,
    HandleInput,
    ListExercises,
    StartExercise,
} from "../wailsjs/go/main/App";

const lastResultStorageKey = "codeTyper.lastResult.v1";

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
        const input = inputForAction(action, state.session, state.settings.inputMode);
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

function completionHeatmap() {
    if (!state.session?.stats.complete) {
        return new Map();
    }
    return new Map(state.mistakeKeys);
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

function renderSettingsForm() {
    renderSettingsFields(elements, state.settings);
}

function handleSettingsChange() {
    state.settings = readSettingsForm(elements);
    saveSettings(state.settings);
    applySettings();
}

function applySettings() {
    applySettingsToDocument(state.settings, elements);
    if (state.session) {
        renderMetrics();
    }
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
