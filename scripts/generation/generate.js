
function randomizeOrigin() {
    current = Math.floor(Math.random() * rows * cols);
    return current;
}

function generatePath() {
    let generating = false;
    grid[current].createUnvisitedNeighbourList();

    if (grid[current].unvisitedNeighbours.length > 0) {
        generating = true;
        let nextRandom = Math.floor(Math.random() * grid[current].unvisitedNeighbours.length);

        removeWalls(grid[current].index, grid[current].unvisitedNeighbours[nextRandom].index);

        tilesVisited.push(current);

        current = grid[current].unvisitedNeighbours[nextRandom].index;
        grid[current].visited = true;

    } else if (tilesVisited.length > 0) {
        generating = true;
        current = tilesVisited.pop();   
    } 

    return generating;
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