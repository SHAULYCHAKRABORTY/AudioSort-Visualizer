const n = 21;
const array = [];
let animationTimeout;
let isAnimating = false;

reStart();
document.getElementById('reStart').addEventListener('click', reStart);
document.getElementById('play').addEventListener('click', play);

let audioCtx = null;

function playNote(freq) {
    if (audioCtx === null) {
        audioCtx = new (AudioContext || window.webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function reStart() {
    if (isAnimating) {
        clearTimeout(animationTimeout);
        isAnimating = false; // Reset animation flag
    }
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars(); // Show initial unsorted bars
}

function play() {
    const copy = [...array];
    const moves = selectionSort(copy);
    animate(moves);
}

function animate(moves) {
    if (moves.length === 0) {
        showBars();
        isAnimating = false;
        return;
    }

    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    playNote(120 + array[i] * 500);
    playNote(700 + array[j] * 500);

    showBars(move);
    isAnimating = true; // Animation is running
    animationTimeout = setTimeout(() => {
        animate(moves);
    }, 300);
}

function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [i, j], type: "compare" });
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            moves.push({ indices: [i, minIndex], type: "swap" });
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
    }
    return moves;
}

function showBars(move) {
    const container = document.getElementById('container');
    container.innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type === "swap" ? "rgb(255, 81, 0)" : "rgb(0, 225, 255)";
        } else {
            bar.style.backgroundColor = "rgb(100, 150, 255)"; // Default color for unselected bars
        }

        container.appendChild(bar);
    }
}
