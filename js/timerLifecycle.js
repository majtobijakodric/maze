function updateTimerText() {
    // Updates timer text in seconds
    timeText.textContent = 'Time left: ' + Math.ceil(time / 1000);
}

function resetRoundState() {
    // Resets game and timer state for a fresh round
    time = ROUND_DURATION_MS;
    lastPos = null;

    // This is the old static maze
    // drawMaze('black', START_BOX_COLOR, END_BOX_COLOR, ctx);

    // Redraws the maze if the round is reset but don't generate a new one
    drawMazeCanvas();

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
        background: '#2b2b2b',
        color: '#f2f2f2',
        confirmButtonText: 'Try again'
    }).then(() => {
        resetRoundState();
    });

    console.log('Time is up');
}

function handleRoundWin() {
    // Handles win state and resets after modal confirmation
    stopRound();

    Swal.fire({
        title: 'You escaped!',
        text: 'You reached the red goal with ' + Math.ceil(time / 1000) + 's left.',
        icon: 'success',
        background: '#2b2b2b',
        color: '#f2f2f2',
        confirmButtonText: 'Play again'
    }).then(() => {
        resetRoundState();
    });
}
