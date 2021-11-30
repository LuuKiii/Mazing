
function randomizeOrigin() {
    current = Math.floor(Math.random() * rows * cols);
    grid[current].visited = true;
    return current;
}

function generatePath() {
    grid[current].neighbour();

    if (grid[current].neighbours.length > 0) {
        let nextRandom = Math.floor(Math.random() * grid[current].neighbours.length);

        removeWalls(grid[current].index, grid[current].neighbours[nextRandom].index);

        tilesVisited.push(current);

        current = grid[current].neighbours[nextRandom].index;
        grid[current].visited = true;

        generatePath();


    } else if (tilesVisited.length > 0) {
        current = tilesVisited.pop();
        generatePath();
    }

    return undefined;
}

function removeWalls(wallIndex, nextWallIndex) {

    let whichWall = wallIndex - nextWallIndex;

    if (whichWall - cols == 0) {
        grid[wallIndex].walls[0] = false;
        grid[nextWallIndex].walls[2] = false;
    } else if (whichWall == -1) {
        grid[wallIndex].walls[1] = false;
        grid[nextWallIndex].walls[3] = false;
    } else if (whichWall + cols == 0) {
        grid[wallIndex].walls[2] = false;
        grid[nextWallIndex].walls[0] = false;
    } else if (whichWall == 1) {
        grid[wallIndex].walls[3] = false;
        grid[nextWallIndex].walls[1] = false;
    }
}