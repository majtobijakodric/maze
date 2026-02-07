// black = maze color, yellow = start box color
resetRoundState();

// Starts a new game round when user clicks start button
startGameBtn.addEventListener('click', startRound);

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
