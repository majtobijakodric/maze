// Made using this tutorial https://www.youtube.com/watch?v=Qfajj84oGUo&list=LL

/*
    VARIABLES ARE IN MAIN.JS
*/


// Call this function to do the whole thing
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

    // Force start and end tiles to be open
    maze[START_TILE.y][START_TILE.x] = open;
    maze[END_TILE.y][END_TILE.x] = open;

    // Draw the maze on the screan
    // drawMaze(); // draws many images (is faster than canvas)
    drawMazeCanvas(); // Draws images on canvas
}

/*
// 
// This draws images
// 
function drawMaze() {

    // clear previous maze
    container.innerHTML = '';

    // draw the maze
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {

            let imageName;
            let tile = maze[i][j];

            if (tile == closed) {
                imageName = closedImg;
            } else {
                imageName = openImg;
            }

            let element = document.createElement('img');
            element.src = imageName;
            container.appendChild(element);

        }

        let br = document.createElement('br');
        container.appendChild(br);
    }
}
 */

function drawMazeCanvas() {
    // Get maze canvas
    const mazeCanvas = canvas;
    const mazeCtx = mazeCanvas.getContext('2d');

    const tileSize = TILE_SIZE;

    mazeCanvas.width = width * tileSize;
    mazeCanvas.height = height * tileSize;
    mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {


            let imageName;
            let tile = maze[i][j];


            if (j === START_TILE.x && i === START_TILE.y) {
                imageName = startImg;
            } else if (j === END_TILE.x && i === END_TILE.y) {
                imageName = endImg;
            } else if (tile == closed) {
                imageName = closedImg;
            } else {
                imageName = openImg;
            }

            // Create an image object for this tile
            let image = new Image();

            // Draw the tile after the image finishes loading
            image.onload = function () {
                mazeCtx.drawImage(image, j * tileSize, i * tileSize);
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

    neighbors = shuffleArray(neighbors);

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
    let dest = maze[destY][destX]; // 1 | 0
    let mid = maze[midY][midX]; // 1 | 0
    if (dest == closed && mid == closed) { // closed = 1, open = 0

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

function shuffleArray(array) {
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
