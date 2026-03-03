const SOUND_DIR = './assets/sound/';
const CAVE_TRACKS = ['cave-1.mp3', 'cave-2.mp3', 'cave-10.mp3'];

let masterVolume = 0.6;
let caveTimeoutId = null;
let tntAudio = null;
let caveSoundFireCount = 4;
let caveSoundsRemaining = 0;

function clampVolume(value) {
    return Math.max(0, Math.min(1, value));
}

function getEffectiveVolume(multiplier = 1) {
    return clampVolume(masterVolume * multiplier);
}

function playOneShot(fileName, volumeMultiplier = 1) {
    const audio = new Audio(SOUND_DIR + fileName);
    audio.volume = getEffectiveVolume(volumeMultiplier);
    audio.play().catch(() => {
        // Ignored because browser autoplay restrictions may block early playback.
    });
    return audio;
}

function playButtonClickSound() {
    playOneShot('button_click.mp3', 0.7);
}

function playOrbStartSound() {
    playOneShot('orb.mp3', 0.9);
}

function stopTntCountdownAudio() {
    if (tntAudio === null) return;

    tntAudio.pause();
    tntAudio.currentTime = 0;
    tntAudio = null;
}

function startTntCountdownAudio() {
    if (tntAudio !== null) return;

    tntAudio = playOneShot('tnt-explosion.mp3', 1);
    tntAudio.addEventListener('ended', () => {
        tntAudio = null;
    }, { once: true });
}

function clearCaveAmbienceTimer() {
    if (caveTimeoutId === null) return;

    clearTimeout(caveTimeoutId);
    caveTimeoutId = null;
}

function setCaveSoundFireCount(count) {
    if (!Number.isFinite(count)) return;

    caveSoundFireCount = Math.max(0, Math.floor(count));
}

function scheduleNextCaveAmbience() {
    clearCaveAmbienceTimer();

    if (caveSoundsRemaining <= 0) return;

    const minDelayMs = 5000;
    const maxDelayMs = 12000;
    const randomDelay = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;

    caveTimeoutId = setTimeout(() => {
        caveTimeoutId = null;

        if (!isRoundActive) return;
        if (time <= 15000) return;
        if (caveSoundsRemaining <= 0) return;

        const randomTrack = CAVE_TRACKS[Math.floor(Math.random() * CAVE_TRACKS.length)];
        playOneShot(randomTrack, 0.5);
        caveSoundsRemaining -= 1;

        scheduleNextCaveAmbience();
    }, randomDelay);
}

function startRoundAudio() {
    stopTntCountdownAudio();
    caveSoundsRemaining = caveSoundFireCount;
    playOrbStartSound();
    scheduleNextCaveAmbience();
}

function stopRoundAudio(keepTntPlaying = false) {
    clearCaveAmbienceTimer();

    if (!keepTntPlaying) {
        stopTntCountdownAudio();
    }
}
