const canvas = document.getElementById('canvas');
const startGameBtn = document.getElementById('start-game-btn');
const howToPlayBtn = document.getElementById('how-to-play-btn');

// Timer stuff
const timeText = document.getElementById('timeText');
const ROUND_DURATION_MS = 60000;
let time = ROUND_DURATION_MS;
let isRoundActive = false;
let timerIntervalId = null;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastPos = null;
