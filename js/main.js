const canvas = document.getElementById('canvas');
const startGameBtn = document.getElementById('start-game-btn');

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

resetRoundState(); // In timerLifecycle.js

// Starts a new game round when user clicks start button
startGameBtn.addEventListener('click', startRound);

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
