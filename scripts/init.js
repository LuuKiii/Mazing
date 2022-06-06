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
    infoContainer.classList.remove("shown");
    nullResult();

    runAllValidators()

    if (errorMessages.length > 0) {
        await assignDefault();
    }
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
    createMethod = result.createMethod;
}

function init() {
    createGrid();
    drawNewGrid();
    setVarsByMazeType();
    eventEnabler();
    updatePointChecksView(true);
    updateLabelsByMazeType();
    onPathAlgoUpdate();
    buttonState(mazeType === 'stroke' ? 'inital' : createMethod === 'generate' ? 'block-inital' : 'draw');
    mouseModeChange('none');
}

function initMazeGeneration() {
    setCurrent();
    eventDisabler();
    buttonState('off')

    if (mazeType === 'stroke') {
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
    //TODO validator for inital pathfinding. code below is just a bandaid
    if (pathAlgorithm === 'jps') {
        if (mazeType !== 'fill') {
            addErrorMsg('JPS nie działa na mapie typu labirynt')
            return;
        }
        if (!is8Dimensions) {
            set8Dimensions();
            addErrorMsg('JPS działa tylko na 8 kierunkach. Przełączono na 8 kierunków.')
        }
    }

    is8Dimensions ? createExtendedNeighbourLists() : createNeighbourLists();
    eventDisabler();
    buttonState('off');
    startEndTileSelector();

    numberOfIterations = 0;
    pathLength = 0;
    timeSpent = performance.now();

    switch (pathAlgorithm) {
        case 'astar':
            setPathfindingVariables();
            isAnimated === true ? astarAnimation() : astar();
            break;
        case 'dijkstra':
            setPathfindingVariablesDijkstra();
            isAnimated === true ? dijkstraAnimation() : dijkstra();
            break;
        case 'greedy':
            setPathfindingVariablesGreedy();
            isAnimated === true ? greedyAnimation() : greedy();
            break;
        case 'jps':
            setJPSVariables();
            isAnimated === true ? jpsAnimation() : jps();
            break;
        case 'dijkstra-old':
            createInitalSets();
            isAnimated === true ? dijkstraOldAnimation() : dijkstraOld();
            break;

    }
}

function afterPathFinding() {
    switch (pathAlgorithm) {
        case 'astar':
            isFinalPath() ? drawFinalPath(currentPathHead) : '';
            break;
        case 'dijkstra':
            isFinalPathDijkstra() ? drawFinalPathDijkstra(currentPathHead) : '';
            break;
        case 'greedy':
            isFinalPathGreedy() ? drawFinalPathGreedy(currentPathHead) : '';
            break;
        case 'jps':
            isFinalPathJPS() ? drawFinalPathJPS(currentPathHeadJPS) : '';
            break;
        case 'dijkstra-old':
            isFinalPathD() ? drawFinalPathD(currentPathDHead) : '';
            break;
    }

    timeSpent = performance.now() - timeSpent;
    
    saveResult(pathAlgorithm, timeSpent, numberOfIterations, pathLength);
    buttonState('end')
    eventEnabler();
}