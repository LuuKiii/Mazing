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
//Dijkstra
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
        isPathfinding = !dijkstraAlgorithm()
    }
    afterPathFinding();
}
//Greedy Search
//ANIMATED

function greedyAnimation() {
    
    if (greedyBFSAlgorithm()) {
        window.cancelAnimationFrame(0);
        afterPathFinding();
        return;
    } else {
        setTimeout(function () {
            numberOfIterations++;
            window.requestAnimationFrame(greedyAnimation)
        }, mazeGenerateDelay);
    }
}
// NON ANIMATED
function greedy() {
    let isPathfinding = true;
    while(isPathfinding){
        numberOfIterations++;
        isPathfinding = !greedyBFSAlgorithm()
    }
    afterPathFinding();
}
//JPS
//ANIMATED

function jpsAnimation() {
    
    if (JPSAlgorithm()) {
        window.cancelAnimationFrame(0);
        afterPathFinding();
        return;
    } else {
        setTimeout(function () {
            numberOfIterations++;
            window.requestAnimationFrame(jpsAnimation)
        }, mazeGenerateDelay);
    }
}

// NON ANIMATED
function jps() {
    let isPathfinding = true;
    while(isPathfinding){
        numberOfIterations++;
        isPathfinding = !JPSAlgorithm()
    }
    afterPathFinding();
}

//DIJKSTRA OLD
//ANIMATED

function dijkstraOldAnimation() {
    if (dijkstraOldAlgorithm()) {
        window.cancelAnimationFrame(0);
        afterPathFinding();
        return;
    } else {
        setTimeout(function () {
            numberOfIterations++;
            window.requestAnimationFrame(dijkstraOldAnimation)
        }, mazeGenerateDelay);
    }
}

// NON ANIMATED

function dijkstraOld() {
    let isPathfinding = true;
    while(isPathfinding){
        numberOfIterations++;
        isPathfinding = !dijkstraOldAlgorithm();
    }
    afterPathFinding();
}
//BEGIN
applySettings()

