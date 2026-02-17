// https://www.youtube.com/watch?v=Qfajj84oGUo&list=LL


const width = 21;
const height = 21;

const open = 1;
const closed = 0;

const open_img = '../assets/block/white_wool.png';
const closed_img = '../assets/block/cobblestone.png';

let maze = [];

function createMaze() {
    // Draw the whole maze with closed tiles (reset maze)
    maze = create2Darray(width, height, closed);

    // Figure out where to strat
    let startX = randomInt(1, width - 1);
    let startY = randomInt(1, height - 1);

    // Set to odd number
    startX = startX % 2 == 0 ? startX - 1 : startX;
    startY = startY % 2 == 0 ? startY - 1 : startY;

    // Recursively dig the starting location
    digAround(startX, startY);

    // Draw the maze on the screan
    drawMaze();
    drawMazeCanvas();
}

function drawMaze() {
    const container = document.getElementById('mazeDisplay');

    // clear previous maze
    container.innerHTML = '';

    // draw the maze
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {

            let imageName;
            let tile = maze[i][j];

            if (tile == closed) {
                imageName = closed_img;
            } else {
                imageName = open_img;
            }

            let element = document.createElement('img');
            element.src = imageName;
            container.appendChild(element);

        }

        let br = document.createElement('br');
        container.appendChild(br);
    }
}

function drawMazeCanvas() {
    // Get maze canvas
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    const tileSize = 16;

    canvas.width = width * tileSize;
    canvas.height = height * tileSize;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {


            let imageName;
            let tile = maze[i][j];


            if (tile == closed) {
                imageName = closed_img;
            } else {
                imageName = open_img;
            }

            // Create an image object for this tile
            let image = new Image();

            // Draw the tile after the image finishes loading
            image.onload = function () {
                ctx.drawImage(image, j * tileSize, i * tileSize, tileSize, tileSize);
            }

            // Start loading the tile image source
            image.src = imageName;
        }
    }

}

function digAround(x, y) {
    maze[y][x] = open;
    let neighbors = [
        { x: x - 2, y: y }, // Left
        { x: x + 2, y: y }, // Right
        { x: x, y: y - 2 }, // Up 
        { x: x, y: y + 2 }  // Down
    ];

    neighbors = shuffle_array(neighbors);

    neighbors.forEach(element => {
        digTo(element.x, element.y, x, y);
    });
}

// Dig between two tiles. Must have not already dug
function digTo(destX, destY, fromX, fromY) {
    let midX = (destX + fromX) / 2;
    let midY = (destY + fromY) / 2;

    // If its not within the map in this direction
    if (!isWithinMap(destX, destY))
        return;

    // If we haven't already dug in this direction
    let dest = maze[destY][destX];
    let mid = maze[midY][midX];
    if (dest == closed && mid == closed) {

        // Try to dig it
        maze[destY][destX] = open;
        maze[midY][midX] = open;

        // Try to dig the neighboring of our new spot
        digAround(destX, destY);
    }
}

// Checks if the location is within the map
function isWithinMap(x, y) {
    return (
        x >= 0 &&               // Checking left
        y >= 0 &&               // Checking up
        x < maze[0].length &&   // Checking right
        y < maze.length         // Checking down
    )
}


function create2Darray(width, height, fill) {
    let array = [];
    for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
            row.push(fill);
        }
        array.push(row);
    }
    return array;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function shuffle_array(array) {
    // Copy our original array, so we don't mutate the original
    let copy = [];
    for (let i = 0; i < array.length; i++) {
        copy.push(array[i])
    }

    // Run through each card, randomly swapping it with another
    for (let i = 0; i < copy.length; i++) {
        let random_spot = randomInt(0, copy.length);

        // Perform the swap
        let temp = copy[random_spot]
        copy[random_spot] = copy[i]
        copy[i] = temp;
    }

    return copy;
}