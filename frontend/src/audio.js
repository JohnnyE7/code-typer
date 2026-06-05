let audioContext = null;

export function playClickSound(kind) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return;
    }

    if (!audioContext) {
        audioContext = new AudioContextClass();
    }

    const context = audioContext;
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
