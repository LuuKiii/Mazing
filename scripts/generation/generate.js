function randomizeOrigin() {
    current = Math.floor(Math.random() * gridRows * gridCols);
    return current;
}

function setCurrent(){
    if(startTileIndex){
        current = startTileIndex;
    }else{
        current = randomizeOrigin();
    }
}

function generatePath() {
    let generating = false;
    grid[current].createUnvisitedNeighbourList();

    if (grid[current].unvisitedNeighbours.length > 0) {
        generating = true;
        let nextRandom = Math.floor(Math.random() * grid[current].unvisitedNeighbours.length);

        removeWalls(grid[current].index, grid[current].unvisitedNeighbours[nextRandom].index);

        tilesVisited.push(current);

        if(tileHoleChance > 0) removeRandomWall(grid[current].unvisitedNeighbours[nextRandom].index);

        current = grid[current].unvisitedNeighbours[nextRandom].index;
        grid[current].visited = true;

    } else if (tilesVisited.length > 0) {
        generating = true;
        current = tilesVisited.pop();   
    } 

    return generating;
}

function removeRandomWall(nextTileWallIndex){
    if(Math.random() * 100 > tileHoleChance) return;

    let randomWallToRemove;

    for(let i = 0; i < 5; i++){
        randomWallToRemove = Math.floor(Math.random() * grid[current].neighboursList.length);

        if( grid[current].neighboursList[randomWallToRemove] != null ){
            if(grid[current].neighboursList[randomWallToRemove].index !== nextTileWallIndex){
                break;
            }
        }
        if(i === 4){
            return;
        }
    }
    removeWalls(grid[current].index, grid[current].neighboursList[randomWallToRemove].index);
}

function removeWalls(wallIndex, nextWallIndex) {

    let whichWall = wallIndex - nextWallIndex;

    if (whichWall - gridCols == 0) {
        grid[wallIndex].walls[0] = false;
        grid[nextWallIndex].walls[2] = false;
    } else if (whichWall == -1) {
        grid[wallIndex].walls[1] = false;
        grid[nextWallIndex].walls[3] = false;
    } else if (whichWall + gridCols == 0) {
        grid[wallIndex].walls[2] = false;
        grid[nextWallIndex].walls[0] = false;
    } else if (whichWall == 1) {
        grid[wallIndex].walls[3] = false;
        grid[nextWallIndex].walls[1] = false;
    }
}