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
    const moves = [];
    quickSort(copy, 0, copy.length - 1, moves);
    animate(moves);
}

function animate(moves) {
    if (moves.length === 0) {
        showBars(); // Ensure final sorted state is shown
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
    }, 30); // Adjust timing to ensure smooth animation
}

function quickSort(array, low, high, moves) {
    if (low < high) {
        const pivotIndex = partition(array, low, high, moves);
        quickSort(array, low, pivotIndex - 1, moves);
        quickSort(array, pivotIndex + 1, high, moves);
    }
}

function partition(array, low, high, moves) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        moves.push({ indices: [j, high], type: "compare" });
        if (array[j] <= pivot) {
            i++;
            moves.push({ indices: [i, j], type: "swap" });
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    moves.push({ indices: [i + 1, high], type: "swap" });
    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    return i + 1;
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
