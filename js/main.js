const canvas = document.getElementById('canvas');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastPos = null;

let colorBoolean = true;

drawMaze('black', ctx); // this function is called in drawMaze.js (drawMaze.js must load before main.js)

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
    let pos = mouse_pos(event);
    collisionCheck(pos, ctx);
    drawOnCanvas(pos.x, pos.y, 'black', ctx);
}

// When mouse clicks on canvas
canvas.onmousedown = function (event) {
    let pos = mouse_pos(event);
    lastPos = pos;
}

function drawOnCanvas(x, y, color, ctx) {
    if (lastPos === null) return; // Return at the start when lastPost = null (happens before mouse is clicked)

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPos = { x: x, y: y };
}

function collisionCheck(pos, ctx) {
    let x = pos.x;
    let y = pos.y;

    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;


    let ImageData = ctx.getImageData(x, y, canvasHeight, canvasWidth)

    console.log(ImageData);


}
