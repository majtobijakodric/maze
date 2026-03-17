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

    const randomSalt = getRandomOffset(x, y);
    const lineWidth = Math.random() * 2 + 0.5;
    const drawSegment = {
        startX: randomSalt.x,
        startY: randomSalt.y,
        endX: randomSalt.x + 1,
        endY: randomSalt.y + 1,
        lineWidth: lineWidth
    };

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth; // Random line width between 0.5 and 2.5
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(drawSegment.startX, drawSegment.startY);
    ctx.lineTo(drawSegment.endX, drawSegment.endY); // Random end point within a small area
    ctx.stroke();

    // Store the segment so it can be replayed exactly later.
    drawSalt.push(drawSegment);

    lastPos = {
        x: x,
        y: y
    };
}

function cancelReverseReplay() {
    if (replayTimeoutId === null) return;

    clearTimeout(replayTimeoutId);
    replayTimeoutId = null;
}

function drawReplaySegment(segment, color, ctx) {
    ctx.strokeStyle = color;
    ctx.lineWidth = segment.lineWidth;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(segment.endX, segment.endY);
    ctx.lineTo(segment.startX, segment.startY);
    ctx.stroke();
}

function replayDrawSaltReverse(ctx, durationMs = 2000) {
    // Stops any older reverse replay before starting a new one
    cancelReverseReplay();

    const totalSegments = drawSalt.length;

    // Returns immediately when there is nothing to replay
    if (totalSegments === 0) {
        return Promise.resolve();
    }

    // Splits the total replay time evenly across all saved segments
    const pauseTimeMs = durationMs / totalSegments;

    // Returns a Promise because this replay does not finish immediately.
    // It draws one saved segment, waits a little, then draws the next one.
    // The Promise is resolved only after the full reverse replay is done,
    // so code like await replayDrawSaltReverse(ctx) can pause until it ends.
    return new Promise((resolve) => {
        function drawNextSegment(segmentIndex) {
            // Finishes replay after all segments have been drawn in reverse order
            if (segmentIndex < 0) {
                replayTimeoutId = null;
                drawSalt = [];
                resolve();
                return;
            }

            // Draws one saved segment, starting from the end of the path
            drawReplaySegment(drawSalt[segmentIndex], END_BOX_COLOR, ctx);

            // Waits a little before drawing the next reverse segment
            replayTimeoutId = setTimeout(() => {
                drawNextSegment(segmentIndex - 1);
            }, pauseTimeMs);
        }

        // Starts replay from the last drawn segment
        drawNextSegment(totalSegments - 1);
    });
}

function getRandomOffset(x, y) {
    // Returns x and y values randomly offset near the given x and y
    return {
        x: Math.round(x + (Math.random() - 0.5) * 4), // Offset x by up to ±2
        y: Math.round(y + (Math.random() - 0.5) * 7)  // Offset y by up to ±3.5
    };
}
