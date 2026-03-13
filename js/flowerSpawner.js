function spawnBackgroundFlowers(flowerNames) {
    // Get the flowers layer div
    const layer = document.getElementById('flowers-layer');

    // Create and append flower elements for each flower name
    flowerNames.forEach((flowerName, index) => {
        // Flower is put on the page here
        layer.appendChild(createFlowerElement(flowerName, index));
    });

    // Return array of all flower elements
    return Array.from(layer.querySelectorAll('.background-flowers'));
}

// Here flower isn't actually put on the page, just created and returned
function createFlowerElement(flowerName, index) {
    // Create an image element for the flower
    const flower = document.createElement('img');

    // Set the CSS class for styling
    flower.className = 'background-flowers';

    // Set unique ID based on index
    flower.id = `flower${index}`;

    // Set the image source path
    flower.src = `./assets/block/${flowerName}.png`;

    // Set alt text for accessibility
    flower.alt = flowerName;

    return flower;
}

function randomizeFlowerPositions(flowers) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    flowers.forEach((flower) => {

        // (|| 50) means that if offsetWidth is null, 0, undefined,... it becomes 50
        const flowerWidth = flower.offsetWidth || 50;
        const flowerHeight = flower.offsetHeight || 50;

        // So flowers don't overflow
        const maxX = Math.max(0, viewportWidth - flowerWidth);
        const maxY = Math.max(0, viewportHeight - flowerHeight);

        // Calculate the random position
        const randomX = Math.floor(Math.random() * (maxX + 1));
        const randomY = Math.floor(Math.random() * (maxY + 1));

        // Set the position
        flower.style.left = `${randomX}px`;
        flower.style.top = `${randomY}px`;
    });
}
