import './style.css';
import { StartExercise, KeyPress, Backspace, GetRender, GetStats } from "../wailsjs/go/main/App";

const code = `fmt.Println("hello world")`;

document.body.innerHTML = `
<div style="padding:40px; font-family: monospace; font-size:20px;">
  <h1>Code Typer</h1>
  <pre id="code"></pre>
  <div style="margin-top:20px; font-size:16px;">
    <span id="typos">Typos: 0</span>
  </div>
</div>
`;

const codeEl = document.getElementById("code");
const typosEl = document.getElementById("typos");

// создаём span для каждого символа
const chars = code.split('').map(c => {
    const span = document.createElement('span');
    span.textContent = c;
    span.style.color = 'gray';
    codeEl.appendChild(span);
    return span;
});

let index = 0;

async function renderState() {
    const render = await GetRender();
    render.forEach((r, i) => {
        chars[i].style.color = r.State === 0 ? 'gray' : r.State === 1 ? 'white' : 'red';
    });

    const stats = await GetStats();
    index = stats.Index;
    typosEl.textContent = `Typos: ${stats.Typos}`;
}

window.addEventListener("keydown", async (e) => {
    if (["Shift","Control","Alt","Meta","CapsLock","Option"].includes(e.key)) return;

    await StartExercise(code);

    if (e.key === "Backspace") {
        await Backspace();
    } else if (index < chars.length) {
        await KeyPress(e.key);
    }

    await renderState();
});