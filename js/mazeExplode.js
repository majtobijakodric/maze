function mazeExplode() {
    for (let i = 0; i < TNT_COUNT; i++) {
        const coords = getRandomMazeCoords();
        particleTrigger(coords.x, coords.y, 1);
    }
}

// Returns random coordinates within the maze (3 blocks from the edge)
function getRandomMazeCoords() {
    return {
        x: Math.floor(Math.random() * (maze[0].length - 6)) + 3,
        y: Math.floor(Math.random() * (maze.length - 6)) + 3
    };
}
