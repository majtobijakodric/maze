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

    if (getPixelColor(pos, ctx) === '0 0 0') {


        // Swal.fire({
        //     title: 'Error!',
        //     text: 'Do you want to continue',
        //     icon: 'error',
        //     confirmButtonText: 'OK'
        // }).then(() => {
        //     drawMaze('black', 'yellow', ctx);
        // });

        console.log('Wall has been hit');
    }

    drawOnCanvas(pos.x, pos.y, 'yellow', ctx);
}

// When mouse clicks on canvas
canvas.onmousedown = function (event) {
    let pos = mouse_pos(event);
    lastPos = pos;
}

function drawOnCanvas(x, y, color, ctx) {
    // Returns before first mouse click && Returns if you don't start at the start box 
    if (lastPos === null && getPixelColor(pos, ctx) === '255 254 1') return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPos = { x: x, y: y };
}

function getPixelColor(pos, ctx) {
    // Third atribute should be '0 0 0' for black

    // Gets pixel data on pixel pos.x & pos.y, (1, 1 is the width and length of the rectangle)
    const pixel = ctx.getImageData(pos.x, pos.y, 1, 1);

    // Puts the rgb values formated like "R G B" in to rgbColor
    const rgbColor = `${pixel.data[0]} ${pixel.data[1]} ${pixel.data[2]}`;
    console.log(rgbColor);
    
    return rgbColor;
}


function startTimer() {
    if (running) {
        console.log('Timer running');
        time -= 100;
        if (time == 0) {
            // Swal.fire({
            //     title: 'Error!',
            //     text: 'Do you want to continue',
            //     icon: 'error',
            //     confirmButtonText: 'OK'
            // }).then(() => {
            //     drawMaze('black', 'yellow', ctx);
            // });
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


