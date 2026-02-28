<h1 align="center">Escape Maze</h1>

<p align="center">
  <a href="https://majtobijakodric.github.io/maze/">🟢 Play Live</a>
</p>

A Minecraft-themed browser maze game built with vanilla HTML, CSS, and JavaScript. A random maze is generated on every page load using a recursive backtracker algorithm, rendered tile-by-tile on an HTML5 canvas with Minecraft texture-pack sprites. You have 60 seconds to draw a path from the green start block to the red goal block without touching any cobblestone walls.

### Table of Contents
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Usage](#setup-and-usage)
- [License](#license)
##

### Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/7dfca946-9a81-4de7-b3a3-868c94174e6c" alt="Game in progress with the 60-second countdown running" width="90%">
</p>
##

### Features
- **Random Maze Generation** – A new 25×25 maze is carved on every page load using a recursive backtracker (depth-first search) algorithm.
- **Canvas-Rendered Tilemap** – Each cell is drawn as a 16×16 Minecraft texture (cobblestone for walls, white wool for paths, green/red wool for start/end).
- **Draw-to-Solve Mechanic** – Click the start tile and drag through the open paths; per-pixel hit detection catches wall collisions instantly.
- **60-Second Countdown Timer** – A ticking timer adds pressure; if it hits zero the round ends with an explosion alert.
- **SweetAlert2 Modals** – Themed pop-ups for "How to play", "About", win, and loss states with Minecraft-style dark UI.
- **Animated Background Flowers** – 45 randomly placed Minecraft flower sprites are scattered across the viewport and re-shuffled on resize.
- **Minecraft UI Styling** – Custom Minecraft font, pixelated tiled background (moss + grass), dark panel frames, and chunky green arcade buttons.
##

### Tech Stack
- HTML5 for structure and canvas element
- CSS3 (custom properties, Flexbox, pixelated rendering) for Minecraft-themed styling
- Vanilla JavaScript for maze generation, canvas drawing, hit detection, and timer logic
- SweetAlert2 for styled modal dialogs
##

### Project Structure
```
maze/
├── index.html
├── LICENSE
├── README.md
├── assets/
│   ├── block/              # Minecraft texture-pack PNGs (wool, cobblestone, flowers, etc.)
│   ├── favicons/           # Favicon set and web manifest
│   └── swal_icons/         # Custom icons for SweetAlert2 modals
├── js/
│   ├── main.js             # App entry point, constants, event listeners
│   ├── randMazeGen.js      # Recursive backtracker maze generation + canvas renderer
│   ├── drawMaze.js         # Legacy static maze drawing (line segments)
│   ├── gameDrawing.js      # Mouse tracking, hit detection, canvas line drawing
│   ├── flowerSpawner.js    # Background flower element creation and positioning
│   └── timerLifecycle.js   # Timer start/stop/tick, win and loss handlers
└── style/
    ├── style.css           # Layout, theming, canvas frame, flower layer
    └── buttons.css         # Minecraft-style arcade button effects
```
##

### Setup and Usage
1. **Clone the repository**
   ```bash
   git clone https://github.com/majtobijakodric/maze.git
   cd maze
   ```
2. **Launch a static server** – Use the VS Code Live Server extension, or open [majtobijakodric.github.io/maze/](https://majtobijakodric.github.io/maze/).
3. **Play** – Click **Start Game**, click the green tile, and draw a path to the red tile before time runs out.

### License
This project is licensed under the [MIT License](LICENSE).
