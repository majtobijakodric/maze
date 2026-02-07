const canvas = document.getElementById('canvas');
const startGameBtn = document.getElementById('start-game-btn');

// Timer stuff
const timeText = document.getElementById('timeText');
const ROUND_DURATION_MS = 60000;
let time = ROUND_DURATION_MS;
let isRoundActive = false;
let timerIntervalId = null;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastPos = null;

// black = maze color, yellow = start box color
resetRoundState();

// Starts a new game round when user clicks start button
startGameBtn.addEventListener('click', startRound);

function mouse_pos(event) {
    const rect = canvas.getBoundingClientRect(); // Gets canvases position
    return { // Return an object

        // Calculate the mouses position relative to the canvas
        x: event.clientX - rect.left,
        y: (event.clientY - rect.top)
    };
}

// When mouse moves on canvas
canvas.onmousemove = function (event) {
    if (!isRoundActive) return;

    if (lastPos === null) return;

    const pos = mouse_pos(event);

    // Checks if any point in this mouse segment touches a wall
    if (lineHitsWall(lastPos, pos, ctx)) {
        stopRound();

        Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            resetRoundState();
        });

        console.log('Wall has been hit');
        return;
    }

    drawOnCanvas(pos.x, pos.y, 'yellow', ctx);
}

// When mouse clicks on canvas
canvas.onmousedown = function (event) {
    if (!isRoundActive) return;

    let pos = mouse_pos(event);

    // Start is allowed only on the yellow box
    if (!isStartPixel(pos, ctx)) {
        lastPos = null;
        return;
    }

    lastPos = pos;
}

function drawOnCanvas(x, y, color, ctx) {
    // Returns before first mouse click
    if (lastPos === null) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPos = { x: x, y: y };
}

function lineHitsWall(fromPos, toPos, ctx) {
    // Gets distance between previous and current mouse position
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;

    // Calculates how many 1px checks are needed on this segment
    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));

    // Checks each point on the segment for wall color
    for (let i = 1; i <= steps; i++) {
        // Normalized progress from 0 to 1
        const t = i / steps;

        // Calculates pixel position at current step
        const pos = {
            x: fromPos.x + (dx * t),
            y: fromPos.y + (dy * t)
        };

        // Reads pixel color at the calculated position
        const pixel = getPixelData(pos, ctx);

        // Returns true as soon as a wall pixel is detected
        if (isWallPixel(pixel)) return true;
    }

    // Returns false when no wall is touched
    return false;
}

function isWallPixel(pixel) {
    // Uses threshold so dark antialias pixels still count as wall
    return pixel.r < 20 && pixel.g < 20 && pixel.b < 20;
}

function isStartPixel(pos, ctx) {
    // Allows yellow shades for better reliability
    const pixel = getPixelData(pos, ctx);
    return pixel.r > 200 && pixel.g > 200 && pixel.b < 80;
}

function getPixelData(pos, ctx) {

    // Gets pixel data on pixel pos.x & pos.y, (1, 1 is the width and length of the rectangle)
    const pixel = ctx.getImageData(pos.x, pos.y, 1, 1);

    // Returns pixel color as an RGB object
    return {
        r: pixel.data[0],
        g: pixel.data[1],
        b: pixel.data[2]
    };
}

function updateTimerText() {
    // Updates timer text in seconds
    timeText.textContent = 'Time left: ' + Math.ceil(time / 1000);
}

function resetRoundState() {
    // Resets game and timer state for a fresh round
    time = ROUND_DURATION_MS;
    lastPos = null;
    drawMaze('black', 'yellow', ctx);
    updateTimerText();
}

function stopTimerInterval() {
    // Clears running timer interval if it exists
    if (timerIntervalId === null) return;

    clearInterval(timerIntervalId);
    timerIntervalId = null;
}

function stopRound() {
    // Stops active round and blocks drawing
    isRoundActive = false;
    stopTimerInterval();
    lastPos = null;
}

function startRound() {
    // Prevents duplicate intervals and starts a fresh round
    stopTimerInterval();
    resetRoundState();
    isRoundActive = true;
    timerIntervalId = setInterval(tickTimer, 100);
}

function tickTimer() {
    // Returns if round is not active
    if (!isRoundActive) return;

    time -= 100;
    if (time < 0) time = 0;

    updateTimerText();

    if (time <= 0) {
        handleTimeExpired();
    }
}

function handleTimeExpired() {
    // Handles timeout state and resets after modal confirmation
    stopRound();

    Swal.fire({
        title: 'Time is up!',
        text: 'The bomb exploded.',
        icon: 'error',
        confirmButtonText: 'Try again'
    }).then(() => {
        resetRoundState();
    });

    console.log('Time is up');
}
