function mouse_pos(event) {
    const rect = canvas.getBoundingClientRect(); // Gets canvases position
    return { // Return an object

        // Calculate the mouses position relative to the canvas
        x: event.clientX - rect.left,
        y: (event.clientY - rect.top)
    };
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

    lastPos = {
        x: x,
        y: y
    };
}

function getLineHitType(fromPos, toPos, ctx) {
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

        // Returns wall when a wall pixel is detected
        if (isWallPixel(pixel)) return 'wall';

        // Returns end when an end-box pixel is detected
        if (isEndPixelColor(pixel)) return 'end';
    }

    // Returns null when no hit is detected
    return null;
}

function isWallPixel(pixel) {
    // Uses threshold so dark antialias pixels still count as wall
    return pixel.r < 20 && pixel.g < 20 && pixel.b < 20;
}

function isStartPixel(pos, ctx) {
    // Allows green shades for better reliability
    const pixel = getPixelData(pos, ctx);
    return pixel.r < 80 && pixel.g > 200 && pixel.b < 80;
}

function isEndPixel(pos, ctx) {
    // Allows red shades for better reliability
    const pixel = getPixelData(pos, ctx);
    return isEndPixelColor(pixel);
}

function isEndPixelColor(pixel) {
    // Uses threshold so antialias red still counts as end box
    return pixel.r > 200 && pixel.g < 80 && pixel.b < 80;
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
