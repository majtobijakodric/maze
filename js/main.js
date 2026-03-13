const canvas = document.getElementById('canvas');
const startGameBtn = document.getElementById('start-game-btn');
const howToPlay = document.getElementById('how-to-play-btn');
const aboutBtn = document.getElementById('about-btn');

// Random maze size (must be odd)
const width = 25;
const height = 25;

const open = 1;
const closed = 0;

const openImg = './assets/block/white_wool.png';
const closedImg = './assets/block/cobblestone.png';
const startImg = './assets/block/green_wool.png';
const endImg = './assets/block/red_wool.png';
const howToPlaySwalImageUrl = './assets/swal_icons/torch_info_swal.png';
const aboutSwalImageUrl = './assets/swal_icons/steve_head.png';
const tntSwalImageUrl = './assets/swal_icons/tnt.png';
const winSwalImageUrl = './assets/swal_icons/diamond_block.png';
const START_TILE = { x: 1, y: 1 };
const END_TILE = { x: width - 2, y: height - 2 };

const container = document.getElementById('mazeDisplay');

const canvasID = 'canvas';

let maze = [];

// draw path color
const PATH_COLOR = 'black';

// Tile size for hit detection
const TILE_SIZE = 16;

// Background flowers
const FLOWER_COUNT = 45;
const ALL_FLOWER_NAMES = ['dandelion', 'poppy', 'blue_orchid', 'allium', 'azure_bluet', 'oxeye_daisy', 'lily_of_the_valley', 'cornflower', 'orange_tulip', 'pink_tulip', 'red_tulip', 'white_tulip', 'torchflower', 'sunflower_front', 'wildflowers'];

const FLOWERS_TO_SPAWN = [];

// push adds an element to the last place
for (let i = 0; i < FLOWER_COUNT; i++) {
    FLOWERS_TO_SPAWN.push(ALL_FLOWER_NAMES[Math.floor(Math.random() * ALL_FLOWER_NAMES.length)]);
}

const flowers = spawnBackgroundFlowers(FLOWERS_TO_SPAWN);

// Timer stuff
const timeText = document.getElementById('timeText');
const START_BOX_COLOR = '#00ff00';
const END_BOX_COLOR = '#ff0000';
const ROUND_DURATION_MS = 60000;
let time = ROUND_DURATION_MS;
let isRoundActive = false;
let timerIntervalId = null;

// Cave sounds
const CAVE_SOUND_FIRE_COUNT = 2;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const ctx = canvas.getContext('2d', { willReadFrequently: true });
let lastPos = null;

randomizeFlowerPositions(flowers);

// Only generates a maze once when the page is loaded, not every time a round is reset
createMaze();

resetRoundState(); // In timerLifecycle.js

console.log(maze);

// When the page is resized it mixes flowers again
window.addEventListener('resize', () => randomizeFlowerPositions(flowers));

// Starts a new game round when user clicks start button
startGameBtn.addEventListener('click', startRound);

// Plays click sound for every button on the page
document.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button');

    if (clickedButton && clickedButton !== startGameBtn) {
        playButtonClickSound();
    }
});

setCaveSoundFireCount(CAVE_SOUND_FIRE_COUNT);

// Show the how to play menu when howToPlay button is clicked
howToPlay.addEventListener('click', () => {
    Swal.fire({
        title: 'How to play',
        text: `You have ${ROUND_DURATION_MS / 1000} seconds. Click the green start block first, move only through white paths, avoid cobblestone walls, and reach the red goal block to win.`,
        imageUrl: howToPlaySwalImageUrl,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: 'Minecraft torch',
        background: '#2b2b2b',
        color: '#f2f2f2',
        confirmButtonText: 'Got it'
    });
});

// Show the about menu when aboutBtn button is clicked
aboutBtn.addEventListener('click', () => {
    Swal.fire({
        title: 'About',
        html: 'Author: Maj Tobija Kodric <br> <a href="https://github.com/majtobijakodric/maze" target="_blank" rel="noopener noreferrer" style="color:#ffffff;text-decoration:underline;">GitHub</a>',
        imageUrl: aboutSwalImageUrl,
        imageWidth: 120,
        imageHeight: 96,
        imageAlt: 'Steve head',
        background: '#2b2b2b',
        color: '#f2f2f2',
        didOpen: () => {
            const footer = document.querySelector('.swal2-footer');
            if (footer) footer.style.borderTop = '0';
        },
        confirmButtonText: 'Close'
    });
});

// When mouse clicks on canvas
canvas.onmousedown = function (event) {

    // Mouse clicks on canvas don't do anyting until the round is started
    if (!isRoundActive) return;

    let pos = mousePos(event);

    let mazeCoords = getMazeArrayCoords(pos.x, pos.y);

    // Start is allowed only on the green tile
    if (!isStartTileAt(mazeCoords.x, mazeCoords.y)) {
        lastPos = null;
        return;
    }

    // Old code (Fixed maze)
    /*   
     // Start is allowed only on the green box
       if (!isStartPixel(pos, ctx)) {
           lastPos = null;
           return;
       }
    */
    lastPos = pos;
}

// When mouse moves on canvas
canvas.onmousemove = function (event) {
    if (!isRoundActive) return;

    if (lastPos === null) return;

    const pos = mousePos(event);

    // Checks what this mouse segment hits first
    const hitType = getLineHitType(lastPos, pos, ctx);

    if (hitType === 'wall') {
        stopRound();

        Swal.fire({
            title: 'You hit a wall!',
            text: 'The path was blocked. Try again from the start.',
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

        console.log('Wall has been hit');
        return;
    }

    if (hitType === 'end') {
        handleRoundWin();
        return;
    }

    drawOnCanvas(pos.x, pos.y, PATH_COLOR, ctx);
}

