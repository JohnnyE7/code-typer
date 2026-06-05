const settingsStorageKey = "codeTyper.settings.v1";

export const defaultSettings = {
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

export function loadSettings() {
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

export function saveSettings(settings) {
    localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

export function renderSettingsForm(elements, settings) {
    elements.layoutSelect.value = settings.layout;
    elements.speedUnitSelect.value = settings.speedUnit;
    elements.indentationSizeSelect.value = String(settings.indentationSize);
    elements.backgroundOpacityInput.value = String(normalizedBackgroundOpacity(settings));
    elements.backgroundOpacityValue.textContent = `${normalizedBackgroundOpacity(settings)}%`;
    elements.accentColorInput.value = normalizedAccentColor(settings);
    elements.inputModeSelect.value = settings.inputMode;
    elements.showHintsInput.checked = settings.showHints;
    elements.errorSoundInput.checked = settings.errorSoundEnabled;
    elements.keypressSoundInput.checked = settings.keypressSoundEnabled;
}

export function readSettingsForm(elements) {
    return {
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
}

export function applySettingsToDocument(settings, elements) {
    document.body.classList.toggle("hide-hints", !settings.showHints);
    document.documentElement.style.setProperty("--indent-size", settings.indentationSize);
    applyBackgroundOpacity(settings, elements);
    applyAccentColor(settings);
}

function applyBackgroundOpacity(settings, elements) {
    const opacityPercent = normalizedBackgroundOpacity(settings);
    const opacity = opacityPercent / 100;
    const root = document.documentElement;

    elements.backgroundOpacityValue.textContent = `${opacityPercent}%`;
    root.style.setProperty("--app-bg-opacity", opacity.toFixed(2));
    root.style.setProperty("--app-warm-opacity", (opacity * 0.5).toFixed(2));
    root.style.setProperty("--app-mid-opacity", (opacity * 0.75).toFixed(2));
    root.style.setProperty("--app-cool-opacity", (opacity * 0.9).toFixed(2));
}

function applyAccentColor(settings) {
    const color = normalizedAccentColor(settings);
    const rgb = hexToRgb(color);
    const strong = mixRgb(rgb, { r: 20, g: 35, b: 55 }, 0.24);
    const root = document.documentElement;

    root.style.setProperty("--accent", color);
    root.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty("--accent-strong", rgbToHex(strong));
}

function normalizedBackgroundOpacity(settings) {
    const value = Number(settings.backgroundOpacity);
    if (!Number.isFinite(value)) {
        return defaultSettings.backgroundOpacity;
    }
    return Math.max(40, Math.min(85, value));
}

function normalizedAccentColor(settings) {
    const value = String(settings.accentColor ?? defaultSettings.accentColor);
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
