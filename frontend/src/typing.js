import { physicalCodeToChar } from "./keyboard";

const closingPairByOpen = {
    "(": ")",
    "[": "]",
    "{": "}",
    "\"": "\"",
    "'": "'",
};

export function normalizeKey(event) {
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

export function inputForAction(action, session, inputMode) {
    if (!session?.expected) {
        return action.value;
    }

    if (inputMode !== "ide") {
        return action.value;
    }

    const expected = session.expected;
    const closingPair = closingPairByOpen[action.value];
    const nextChar = session.render[session.stats.index + 1]?.char;
    if (!closingPair || expected !== action.value || nextChar !== closingPair) {
        return action.value;
    }

    return action.value + closingPair;
}

export function isRestartShortcut(event) {
    return event.metaKey && event.code === "KeyR" && !event.ctrlKey && !event.altKey;
}
