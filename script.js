const n=21;
const array =[];
let animationTimeout;
let isAnimating = false;

reStart();
document.getElementById('reStart').addEventListener('click', reStart);
document.getElementById('play').addEventListener('click', play);

let audioCtx=null;
function playNote(freq){
    if (audioCtx===null){
        audioCtx=new(
            AudioContext || window.webkitAudioContext
        )();
    
    }const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(0,audioCtx.currentTime+dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function reStart(){

    if (isAnimating) {
        clearTimeout(animationTimeout);
        isAnimating = false;  // Reset animation flag
    }
    for(let i=0;i<n;i++){
        array[i]=Math.random();
        
    }
    showBars();
    
}
function play(){
    const copy=[...array]
    const moves=bubbleSort(copy);
    animate(moves);
}
function animate(moves){
    if(moves.length===0){
        showBars();
        isAnimating = false;
        return;
    }
    const move=moves.shift();
    const [i,j]=move.indices;
    if(move.type==="swaps"){
        [array[i],array[j]]=[array[j],array[i]];
    }

    playNote(120+array[i]*500);
    playNote(700+array[j]*500);

    showBars(move);
    isAnimating = true; // Animation is running
    animationTimeout = setTimeout(function () {
        animate(moves);
    }, 300);
}
// function getRandomColor() {
//     // Generate a random color in hexadecimal format
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }
function bubbleSort(array){
    const moves=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            moves.push({indices:[i-1,i],type:"comp"});
            if(array[i-1]>array[i]){
                swapped=true;
                moves.push({indices:[i-1,i],type:"swaps"});
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return moves;
}
function showBars(move){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        // bar.style.backgroundColor = getRandomColor();
        bar.classList.add("bar");
        if(move && move.indices.includes(i)){
            bar.style.backgroundColor=move.type=="swaps"?"rgb(255, 81, 0":"rgb(0, 225, 255)";
        }
        container.appendChild(bar);
    }
}