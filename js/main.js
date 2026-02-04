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

    if (lastPos === null) return;

    const pos = mouse_pos(event);
    if (collisionCheck(pos, ctx)) {
        // Swal.fire({
        //     title: 'Error!',
        //     text: 'Do you want to continue',
        //     icon: 'error',
        //     confirmButtonText: 'Cool'
        // })

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
    // return true if detected color is black (1 0 1)
    return getPixelColor(pos, ctx, '1 0 1') === '1 0 1' ? true : false;
}

function getPixelColor(pos, ctx, color) {
    // Third atribute should be '1 0 1' for black

    // Gets pixel data on pixel pos.x & pos.y
    const pixel = ctx.getImageData(pos.x, pos.y, 1, 1);

    // Puts the rgb values formated like "R G B" in to rgbColor
    const rgbColor = `${pixel.data[0]} ${pixel.data[1]} ${pixel.data[2]}`;
    return rgbColor;
}
