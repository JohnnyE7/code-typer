export const keyboardLayout = [
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

export const heatmapExcludedKeys = new Set(["backspace", "caps", "enter", "shift-left", "shift-right", "control", "option", "option-right", "command-left", "command-right"]);

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

export function physicalCodeToChar(event) {
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

export function keyIdsForEvent(event) {
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

export function expectedKeys(expected) {
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

export function keyIdsForChar(char) {
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

export function serviceKeyIdForEvent(event) {
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

function shiftKeyFor(baseKey) {
    return leftHandKeys.has(baseKey) ? "shift-right" : "shift-left";
}

function key(id, label, chars = [], width = 1, group = id) {
    return { id, label, chars, width, group };
}
