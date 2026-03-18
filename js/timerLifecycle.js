function updateTimerText() {
    // Updates timer text in seconds
    timeText.textContent = 'Time left: ' + Math.ceil(time / 1000);
}

function resetRoundState() {
    // Resets game and timer state for a fresh round
    time = ROUND_DURATION_MS;
    lastPos = null;
    drawSalt = [];
    cancelReverseReplay();

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
    stopRoundAudio();
}

function startRound() {
    // Prevents duplicate intervals and starts a fresh round
    stopTimerInterval();
    resetRoundState();
    isRoundActive = true;
    startRoundAudio();
    timerIntervalId = setInterval(tickTimer, 100);
}

function tickTimer() {
    // Returns if round is not active
    if (!isRoundActive) return;

    time -= 100;
    if (time < 0) time = 0;

    if (time === 4000) {
        startTntCountdownAudio();
    }

    updateTimerText();

    if (time <= 0) {
        handleTimeExpired();
    }
}

function handleTimeExpired() {
    // Handles timeout state and resets after modal confirmation
    stopRoundAudio(true);
    isRoundActive = false;
    stopTimerInterval();
    lastPos = null;

    Swal.fire({
        title: 'Time is up!',
        text: 'The bomb exploded.',
        imageUrl: tntSwalImageUrl,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: 'Minecraft tnt',
        background: '#2b2b2b',
        color: '#f2f2f2',
        confirmButtonText: 'Try again'
    }).then(() => {
        resetRoundState();
    });

    console.log('Time is up');
}

async function handleRoundWin() {
    // Handles win state by replaying the path, showing the win modal, and then resetting
    stopRound();
    await replayDrawSaltReverse(ctx, REDRAW_TIME_MS);

    // Particles
    particleTrigger(Math.floor(width / 2), Math.floor(height / 2), TNT_SCALE);

    fillObsidian(); // Redraw maze with obsidian for win effect
    // Sound effect
    playOneShot('challenge_complete.mp3');

    // Timeout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    Swal.fire({
        title: 'You escaped!',
        text: 'You reached the red goal with ' + Math.ceil(time / 1000) + ' s left.',
        imageUrl: winSwalImageUrl,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: 'Diamond block',
        background: '#2b2b2b',
        color: '#f2f2f2',
        confirmButtonText: 'Play again'
    }).then(() => {
        resetRoundState();
    });
}
