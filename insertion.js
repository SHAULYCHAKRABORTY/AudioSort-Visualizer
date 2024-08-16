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
    const moves = getInsertionSortAnimations(copy);
    animate(moves);
}

function animate(moves) {
    if (moves.length === 0) {
        showBars();
        isAnimating = false;
        return;
    }

    const [i, j, doSwap, sortedTill] = moves.shift();

    // Ensure indices are within bounds
    if (i < array.length && j < array.length) {
        if (doSwap) {
            [array[i], array[j]] = [array[j], array[i]];
        }

        playNote(150 + array[i] * 500);
        playNote(200 + array[j] * 500);

        showBars({ indices: [i, j], type: doSwap ? "swap" : "compare" });

        isAnimating = true; // Animation is running
        animationTimeout = setTimeout(() => {
            animate(moves);
        }, 300);
    } else {
        console.error("Invalid indices:", i, j);
    }
}

function getInsertionSortAnimations(array) {
    const animations = [];
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        animations.push([i, j, false, i]); // Compare animation

        while (j >= 0 && array[j] > key) {
            animations.push([j, j + 1, false, i]); // Compare animation
            animations.push([j, j + 1, true, i]); // Swap animation
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            j--;
        }
        array[j + 1] = key;
    }

    animations.push([array.length - 1, array.length - 1, false, array.length - 1]); // Final state
    return animations;
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
