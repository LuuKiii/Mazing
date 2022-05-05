// INIT
async function applySettings(){
    loading = true;
    await assignValues();
    initGeneration();
    loading = false;
}

function onDelayChange(){
    mazeGenerateDelay = Number(delayInput.value) * 200;
}

async function assignValues(){
    cols = Number(numberOfColumnsInput.value);
    rows = cols;
    grid = []
    tileSide = canvas.width/cols;
    mazeGenerateDelay = Number(delayInput.value) * 200;

    runAllValidators()

    if( errorMessages.length > 0){
        await assignDefault()
        errorMessages = []
    }
    console.log(errorMessages)
}

async function assignDefault(){
    const response = await fetch ('./scripts/alibraries/default.json')
    const result = await response.json()
    
    numberOfColumnsInput.value = result.cols;
    cols = result.cols;
    rows = cols;
    grid = [];
    tileSide = canvas.width/cols;
    mazeGenerateDelay = result.mazeGenerateDelay;
}

function initGeneration() {
    createGrid();
    randomizeOrigin();
    drawGrid();
    mouseEventHander();
}

function initMazeGenAnimation() {
    eventDisabler();
    // grid[current].currentBaseColor = "#2a3654"
    mazeGenAnimation();
}

function initPathFinding() {
    eventDisabler();
    //pushing the starting point to openSet, object pushed is rated in metrics important for A*
    let TileRated = new TileRating(0, 0, 0, 0);
    openSet.push(TileRated)
    destinationTileIndex = grid.length-1; //Destination of pathfinding, for now its just bottom right corner
    pathfindingAnimation();
}

//MAIN

function mazeGenAnimation() {

    if (generatePath()) {
        setTimeout(function () {
            window.requestAnimationFrame(mazeGenAnimation)
        }, mazeGenerateDelay);

    } else {
        window.cancelAnimationFrame(0);
        mouseEventHander();
        pathfindingBtn.disabled = false;

    }

    grid[current].draw();
}

function pathfindingAnimation() {

    if (!aStar()) {
        window.cancelAnimationFrame(0);
        return
    } else {
        setTimeout(function () {
            window.requestAnimationFrame(pathfindingAnimation)
        }, mazeGenerateDelay);
    }
}

applySettings()

