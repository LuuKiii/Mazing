//MAIN = MAZE GENERATION
// ANIMATED
function mazeGenAnimation() {

    if (generatePath()) {
        setTimeout(function () {
            window.requestAnimationFrame(mazeGenAnimation)
        }, mazeGenerateDelay);

    } else {
        window.cancelAnimationFrame(0);
        afterMazeGeneration();
    }

    grid[current].draw();
}

// NON ANIMATED
function mazeGeneration() {
    let isGenerating = true;
    while(isGenerating) {
        isGenerating = generatePath();
    }

    drawGrid();
    afterMazeGeneration();
}

// A STAR
// ANIMATED
function astarAnimation() {
    
    if (aStarAlgorithm()) {
        window.cancelAnimationFrame(0);
        afterPathFinding();
        return;
    } else {
        setTimeout(function () {
            numberOfIterations++;
            window.requestAnimationFrame(astarAnimation)
        }, mazeGenerateDelay);
    }
}

// NON ANIMATED
function astar() {
    let isPathfinding = true;
    while(isPathfinding){
        numberOfIterations++;
        isPathfinding = !aStarAlgorithm()
    }
    afterPathFinding();
}

//DIJKSTRA
//ANIMATED

function dijkstraAnimation() {
    if (dijkstraAlgorithm()) {
        window.cancelAnimationFrame(0);
        afterPathFinding();
        return;
    } else {
        setTimeout(function () {
            numberOfIterations++;
            window.requestAnimationFrame(dijkstraAnimation)
        }, mazeGenerateDelay);
    }
}

// NON ANIMATED

function dijkstra() {
    let isPathfinding = true;
    while(isPathfinding){
        numberOfIterations++;
        isPathfinding = !dijkstraAlgorithm();
    }
    afterPathFinding();
}
//BEGIN
applySettings()

