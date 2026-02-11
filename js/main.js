const canvas = document.getElementById('canvas');
const startGameBtn = document.getElementById('start-game-btn');
const howToPlay = document.getElementById('how-to-play-btn');

// Background flowers
const flowers = [...document.querySelectorAll('[id^="flower"]')];

// Timer stuff
const timeText = document.getElementById('timeText');
const START_BOX_COLOR = '#00ff00';
const END_BOX_COLOR = '#ff0000';
const ROUND_DURATION_MS = 60000;
let time = ROUND_DURATION_MS;
let isRoundActive = false;
let timerIntervalId = null;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastPos = null;

randomFlowers(flowers);

resetRoundState(); // In timerLifecycle.js

// When the page is resized it mixes flowers again
window.addEventListener('resize', () => randomFlowers(flowers));

// Starts a new game round when user clicks start button
startGameBtn.addEventListener('click', startRound);

// Show the how to play menu when howToPlay button is clicked
howToPlay.addEventListener('click', () => {
    Swal.fire({
        title: 'How to play',
        text: 'You have 60 seconds. Start on the green box, avoid black walls, and reach the red box to win.',
        icon: 'info',
        confirmButtonText: 'Got it'
    });
});

// When mouse clicks on canvas
canvas.onmousedown = function (event) {

    // Mouse clicks on canvas don't do anyting until the round is started
    if (!isRoundActive) return;

    let pos = mouse_pos(event);

    // Start is allowed only on the green box
    if (!isStartPixel(pos, ctx)) {
        lastPos = null;
        return;
    }

    lastPos = pos;
}

// When mouse moves on canvas
canvas.onmousemove = function (event) {
    if (!isRoundActive) return;

    if (lastPos === null) return;

    const pos = mouse_pos(event);

    // Checks what this mouse segment hits first
    const hitType = getLineHitType(lastPos, pos, ctx);

    if (hitType === 'wall') {
        stopRound();

        Swal.fire({
            title: 'You hit a wall!',
            text: 'The path was blocked. Try again from the start.',
            icon: 'error',
            confirmButtonText: 'Try again'
        }).then(() => {
            resetRoundState();
        });

        console.log('Wall has been hit');
        return;
    }

    if (hitType === 'end') {
        handleRoundWin();
        return;
    }

    drawOnCanvas(pos.x, pos.y, 'yellow', ctx);
}
