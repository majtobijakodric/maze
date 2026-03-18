function fillObsidian() {
    const mazeCanvas = canvas;
    const mazeCtx = mazeCanvas.getContext('2d');

    const tileSize = TILE_SIZE;

    mazeCanvas.width = width * tileSize;
    mazeCanvas.height = height * tileSize;
    mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            console.log('in fun');

            let imageName = Math.random() < 0.08 ? crying_obsidianImg : obsidianImg;
            let tile = maze[i][j];

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