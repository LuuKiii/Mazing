// INIT
async function applySettings() {
    loading = true;
    await assignValues();
    init();
    loading = false;
}

async function assignValues() {
    gridCols = Number(numberOfColumnsInput.value);
    gridRows = gridCols;
    grid = [];
    tileSide = canvas.width / gridCols;
    mazeGenerateDelay = Number(delayInput.value) * 200;
    tileHoleChance = Number(tileHoleChanceInput.value) * 20;
    mazeType = getRadioValue(buttonsObj.radio.mazeTypeBtn);
    createMethod = getRadioValue(buttonsObj.radio.createMethodBtn);
    drawFillType = getRadioValue(buttonsObj.radio.isFilledBtn);

    runAllValidators()

    if (errorMessages.length > 0) {
        await assignDefault();
    }

    console.log('Error Messages : ' + (errorMessages.length > 0 ? errorMessages : 'none'));
    errorMessages = [];
}

async function assignDefault() {
    const response = await fetch('./scripts/alibraries/default.json')
    const result = await response.json()

    numberOfColumnsInput.value = result.cols;
    gridCols = result.cols;
    gridRows = gridCols;
    grid = [];
    tileSide = canvas.width / gridCols;
    mazeGenerateDelay = result.mazeGenerateDelay;
    mazeType = result.mazeType;
    createMethod =  result.createMethod;
}

function init() {
    createGrid();
    drawNewGrid();
    setVarsByMazeType();
    eventEnabler();
    updatePointChecksView(true);
    updateLabelsByMazeType();
    buttonState(mazeType === 'stroke' ? 'inital' : createMethod === 'generate' ? 'block-inital' : 'draw');
    mouseModeChange('none');
}

function initMazeGeneration() {
    setCurrent();
    eventDisabler();
    buttonState('off')

    if(mazeType === 'stroke'){
        isAnimated ? mazeGenAnimation() : mazeGeneration();
    } else {
        insertRandomWalls();
        afterMazeGeneration();
    }
}

function afterMazeGeneration() {
    buttonState('beforePathfinding')
    eventEnabler();
}

function initPathFinding() {
    numberOfIterations = 0;
    pathLength = 0;
    eventDisabler();
    buttonState('off');
    //pushing the starting point to openSet, object pushed is rated in metrics important for A*
    startEndTileSelector();
    setPathfindingVariables();
    timeSpent = performance.now();
    isAnimated === true ? pathfindingAnimation() : pathfinding();
}

function afterPathFinding() {
    timeSpent = performance.now() - timeSpent;
    console.log('Czas generowania ścieżki : ' + timeSpent + 'ms')
    console.log('Liczba wykonanych iteracji w celu wyznaczenia ścieżki : ' + numberOfIterations)
    errorMessages.length > 0 ? '' : drawFinalPath(currentPathHead);
    console.log('Długość ściezki : ' + pathLength)
    buttonState('end')
    eventEnabler();
}

//MAIN
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

function pathfindingAnimation() {
    
    if (aStarAlgorithm()) {
        window.cancelAnimationFrame(0);
        afterPathFinding();
        return;
    } else {
        setTimeout(function () {
            numberOfIterations++;
            window.requestAnimationFrame(pathfindingAnimation)
        }, mazeGenerateDelay);
    }
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

function pathfinding() {
    let isPathfinding = true;
    while(isPathfinding){
        numberOfIterations++;
        isPathfinding = !aStarAlgorithm()
    }
    afterPathFinding();
}

//BEGIN
applySettings()

