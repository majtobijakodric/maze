const canvas = document.getElementById('canvas');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d');
let lastPos = null;

function mouse_pos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: (event.clientY - rect.top)
    };
}

canvas.onmousemove = function (event) {
    let pos = mouse_pos(event);
    drawOnCanvas(pos.x, pos.y, 'black', ctx);
}

canvas.onmousedown = function (event) {
    let pos = mouse_pos(event);
    lastPos = pos;
}

function drawOnCanvas(x, y, color, ctx) {
    if (lastPos === null) return; // Return at the start when lastPost = null
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    lastPos = { x: x, y: y };
}
