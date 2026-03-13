function mousePos(event) {
    const rect = canvas.getBoundingClientRect(); // Gets canvases position
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return { // Return an object

        // Calculate mouse position in canvas pixels
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

// Get x, y coordinates of maze[][]
function getMazeArrayCoords(x, y) {
    const tx = Math.floor(x / TILE_SIZE);
    const ty = Math.floor(y / TILE_SIZE);

    return {
        x: tx,
        y: ty
    };
}

function isWithinMazeBounds(x, y) {
    // Checks whether the tile index exists in maze[][]
    if (maze.length === 0 || maze[0].length === 0) return false;

    return (
        y >= 0 &&
        x >= 0 &&
        y < maze.length &&
        x < maze[0].length
    );
}

function isClosedTileAt(x, y) {
    // Out of bounds should behave as a wall
    if (!isWithinMazeBounds(x, y)) return true;

    const tileValue = maze[y][x];
    return tileValue === closed;
}

function isStartTileAt(x, y) {
    return x === START_TILE.x && y === START_TILE.y;
}

function isEndTileAt(x, y) {
    return x === END_TILE.x && y === END_TILE.y;
}

function getLineHitType(fromPos, toPos) {
    // Gets distance between previous and current mouse position
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;

    // Calculates how many 1px checks are needed on this segment
    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));

    // Checks each point on the segment using maze[][] tiles
    for (let i = 1; i <= steps; i++) {
        // Normalized progress from 0 to 1
        const t = i / steps;

        // Calculates pixel position at current step
        const pixelX = fromPos.x + (dx * t);
        const pixelY = fromPos.y + (dy * t);

        // Converts pixel position to maze[][] tile index
        const mazeCoords = getMazeArrayCoords(pixelX, pixelY);

        // Out of bounds is handled as wall
        if (!isWithinMazeBounds(mazeCoords.x, mazeCoords.y)) return 'wall';

        // Returns wall when a closed tile is detected
        if (isClosedTileAt(mazeCoords.x, mazeCoords.y)) return 'wall';

        // Returns end when the end tile is detected
        if (isEndTileAt(mazeCoords.x, mazeCoords.y)) return 'end';
    }

    // Returns null when no hit is detected
    return null;
}

function drawOnCanvas(x, y, color, ctx) {
    // Returns before first mouse click
    if (lastPos === null) return;

    let randomSalt = getRandomOffset(x, y);

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.random() * 2 + 0.5; // Random line width between 0.5 and 2.5
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(randomSalt.x, randomSalt.y);
    ctx.lineTo(randomSalt.x + 1, randomSalt.y + 1); // Random end point within a small area
    ctx.stroke();

    lastPos = {
        x: x,
        y: y
    };
}

function getRandomOffset(x, y) {
    // Returns x and y values randomly offset near the given x and y
    return {
        x: Math.round(x + (Math.random() - 0.5) * 4), // Offset x by up to ±2
        y: Math.round(y + (Math.random() - 0.5) * 7)  // Offset y by up to ±3.5
    };
}

