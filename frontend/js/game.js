/**
 * Suraksha360 - Stealth Disguise Mode (Tic Tac Toe Game Logic)
 * Enhanced with safe audio fallbacks and graceful DOM handling
 */

console.log("Suraksha360 Disguise Game initialized");

// Safe Audio wrapper preventing uncaught promise errors if audio files are unavailable
function playAudioSafe(filename) {
    try {
        const audio = new Audio(filename);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Audio file missing or autoplay blocked - safely ignore
            });
        }
    } catch (e) {
        // Fallback for environments where Audio is restricted
    }
}

let turn = "X";
let isgameover = false;

// Function to toggle the turn
const changeTurn = () => {
    return turn === "X" ? "0" : "X";
};

// Function to check for a win condition
const checkWin = () => {
    const boxtext = document.getElementsByClassName('boxtext');
    const wins = [
        [0, 1, 2, 5, 5, 0],
        [3, 4, 5, 5, 15, 0],
        [6, 7, 8, 5, 25, 0],
        [0, 3, 6, -5, 15, 90],
        [1, 4, 7, 5, 15, 90],
        [2, 5, 8, 15, 15, 90],
        [0, 4, 8, 5, 15, 45],
        [2, 4, 6, 5, 15, 135],
    ];

    wins.forEach(e => {
        if (
            boxtext[e[0]] && boxtext[e[1]] && boxtext[e[2]] &&
            boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[0]].innerText !== ""
        ) {
            const infoElement = document.querySelector('.info');
            if (infoElement) {
                infoElement.innerText = boxtext[e[0]].innerText + " Won 🎉";
            }
            isgameover = true;
            playAudioSafe("gameover.mp3");

            const imgBox = document.querySelector('.imgbox img');
            if (imgBox) {
                imgBox.style.width = "180px";
            }

            const line = document.querySelector(".line");
            if (line) {
                line.style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`;
                line.style.width = "20vw";
            }
        }
    });
};

// Game Board Event Listeners
const boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    const boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext && boxtext.innerText === '' && !isgameover) {
            boxtext.innerText = turn;
            turn = changeTurn();
            playAudioSafe("ting.mp3");
            checkWin();
            if (!isgameover) {
                const info = document.getElementsByClassName("info")[0];
                if (info) {
                    info.innerText = "Turn for " + turn;
                }
            }
        }
    });
});

// Reset Button Listener
const resetBtn = document.getElementById('reset');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        const boxtexts = document.querySelectorAll('.boxtext');
        Array.from(boxtexts).forEach(element => {
            element.innerText = "";
        });
        turn = "X";
        isgameover = false;

        const line = document.querySelector(".line");
        if (line) {
            line.style.width = "0vw";
        }

        const info = document.getElementsByClassName("info")[0];
        if (info) {
            info.innerText = "Turn for " + turn;
        }

        const imgBox = document.querySelector('.imgbox img');
        if (imgBox) {
            imgBox.style.width = "0px";
        }
    });
}
