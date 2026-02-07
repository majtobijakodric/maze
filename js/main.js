const canvas = document.getElementById('canvas');

// Timer stuff
const timeText = document.getElementById('timeText');
let time = 60000; // 60 sec
let running = true;


canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastPos = null;

let colorBoolean = true;

// black = maze color, yellow = start box color
drawMaze('black', 'yellow', ctx); // This function is called in drawMaze.js (drawMaze.js must load before main.js)

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

    if (lastPos === null) return;

    const pos = mouse_pos(event);

    // Checks if any point in this mouse segment touches a wall
    if (lineHitsWall(lastPos, pos, ctx)) {
        Swal.fire({
            title: 'Error!',
            text: 'Do you want to continue',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            drawMaze('black', 'yellow', ctx);
        });

        console.log('Wall has been hit');
        return;
    }

    drawOnCanvas(pos.x, pos.y, 'yellow', ctx);
}

// When mouse clicks on canvas
canvas.onmousedown = function (event) {
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


function startTimer() {
    if (running) {
        console.log('Timer running');
        time -= 100;
        if (time == 0) {
            Swal.fire({
                title: 'Time is up!',
                text: 'Bomb exploded',
                icon: 'error',
                confirmButtonText: 'Try again?'
            }).then(() => {
                drawMaze('black', 'yellow', ctx);
            });
            console.log('Time is up');

        } else
            timeText.textContent = 'Time left ' + (time / 1000);
    }
}

function pauseTimer() {
    running = false;
    console.log('Timer paused');
}

function resumeTimer() {
    running = true;
    console.log('Timer resumed');
}

function resetTimer() {
    time = 60000;
    timeText.textContent = 'Time left ' + (time / 1000);
    running = false;
    console.log('Timer reset');
}
