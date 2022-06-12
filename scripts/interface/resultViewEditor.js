class ResultSet {
    constructor(algorithmName, timeSpent, numberOfIterations, pathLength) {
        this.algorithmName = algorithmName;
        this.timeSpent = timeSpent;
        this.numberOfIterations = numberOfIterations;
        this.pathLength = pathLength;
    }
}

function saveResult(algorithmName, timeSpent, numberOfIterations, pathLength) {
    switch (algorithmName) {
        case 'astar':
            resultTable[0] = new ResultSet(algorithmName, timeSpent, numberOfIterations, pathLength);
            break;
        case 'dijkstra':
            resultTable[1] = new ResultSet(algorithmName, timeSpent, numberOfIterations, pathLength);
            break;
        case 'greedy':
            resultTable[2] = new ResultSet(algorithmName, timeSpent, numberOfIterations, pathLength);
            break;
    }

    showResultList();
    updateResultView();
}

function updateResultView() {
    removePreviousResult();
    let height = 4;
    let iteration = 0;
    let nubmerOfSearchableTiles = countSearchableTiles();

    resultTable.forEach(item => {
        if (!item) return;
        iteration++;
        height += 10;
        returnPath = item.pathLength > 0 ? item.pathLength : 'Nie znaleziono ścieżki';

        document.getElementById("info-result").insertAdjacentHTML('beforeend', `
        <div id="result-`+ iteration + `"class='resultItem' style="margin-bottom: 2rem; height: 8rem; opacity: 1">
            <h2 style="margin: 0">
                `+ iteration + '. ' + getAlgorithmName(item.algorithmName) + `
            </h2>
            <div style="padding-left: 1rem;">
            <div>
                <label>Czas generowania ścieżki : </label>
                <a>` + item.timeSpent.toFixed(2) + `ms</a>
            </div>
            <div>
                <label>Ilość pól możliwych do przeszukania : </label>
                <a>` + nubmerOfSearchableTiles + `</a>
            </div>
            <div>
                <label>Liczba wykonanych iteracji w celu wyznaczenia ścieżki :
                </label>
                <a>` + item.numberOfIterations + `</a>
            </div>
            <div>
                <label> Procent przeszukanych pól :
                </label>
                <a>` + ((item.numberOfIterations / nubmerOfSearchableTiles) * 100).toFixed(2) + `%</a>
            </div>
            <div>
                <label>Długość ścieżki : </label>
                <a>` + returnPath + `</a>
            </div>
            <div>
                <label>Poziom trudności labiryntu : </label>
                <a>` + findDifficulty(nubmerOfSearchableTiles, item.numberOfIterations, returnPath) + `</a>
            </div>
            </div>
        </div>
        `)
    })

    document.getElementById('info-container').style.height = height + 'rem';
}

function findDifficulty(numberOfTiles, numberOfSearchedTiles, lengthOfPath){
    if (numberOfTiles < 1) return 'Nie można ustalić';
    if (numberOfSearchedTiles < 1) return 'Nie można ustalić';
    if (isNaN(lengthOfPath) || lengthOfPath < 1) return 'Nie można ustalić';

    let searchedPercentage = ((numberOfSearchedTiles - lengthOfPath) / (numberOfTiles-lengthOfPath)) * 100;
    let pathComplexityPercentage = 100 - (getBasicPath() / lengthOfPath * 100);

    let score = searchedPercentage + pathComplexityPercentage;

    score = lowerForShortPath(score, lengthOfPath, numberOfTiles);

    if(score < 120) return 'Łatwy';
    if(score < 160) return 'Średni';
    return 'Trudny';
}

function lowerForShortPath(score, length, searchableTiles){
    if(length < 10) return 0;
    if(length > searchableTiles * 0.99) return 0;
    if(findNumberOfForksAlongPath() < 4) return 0;
    return score;
}

function getBasicPath(){
    distanceX = Math.abs(grid[startTileIndex].positionX/tileSide - grid[destinationTileIndex].positionX/tileSide) 
    distanceY = Math.abs(grid[startTileIndex].positionY/tileSide - grid[destinationTileIndex].positionY/tileSide) 
    basicPathLength = distanceX + distanceY;
    
    if(is8Dimensions === true){
        let a = 1;
    
        basicPathLength = (a * basicPathLength + (a - 2 * a) * Math.min(distanceX, distanceY));
    }

    return basicPathLength + 1;
}

function findNumberOfForksAlongPath(){
    let numberOfForks = 0;
    for(const gridEl of grid){
        //TODO: Warning - Giga cursed - checking if object is finalpath by its current color, change ASAP
        if(gridEl.currentBaseColor !== '#c4bc66'){
            if(gridEl.index !== startTileIndex || gridEl.index !== destinationTileIndex){
                continue;
            }
            numberOfForks++;
        }

        numberOfForks = numberOfForks - 2;
        let iteration = -1;
        for(const neighbour of gridEl.neighboursList){
            iteration++;
            if(!neighbour) continue;
            if(isObstacle(neighbour, gridEl.index, iteration)) continue;

            numberOfForks++;
        }
    }

    return numberOfForks;
}

function nullResult() {
    removePreviousResult();
    document.getElementById('info-container').style.height = 0;
    resultTable = [null, null, null];
}

function removePreviousResult() {
    for (i = 0; i < resultTable.length; i++) {
        if (!document.getElementById("result-" + (i + 1))) continue;
        document.getElementById("result-" + (i + 1)).remove();
    }
}

function countSearchableTiles() {
    let counter = 0;
    for (i = 0; i < grid.length; i++) {

        if (grid[i].type !== 'wall')
            counter++;
    }
    return counter;
}

function getAlgorithmName(name) {
    switch (name) {
        case 'astar':
            return 'A*';
        case 'dijkstra':
            return 'Dijkstra';
        case 'greedy':
            return 'Greedy Best-First Search';
    }
    return name;
}

function showResultList() {
    infoContainer.classList.add("shown");
}

function closeResultList() {
    infoContainer.classList.remove("shown");
}

//ERROR MANAGMENT

function addErrorMsg(errorMsg) {
    errorMessages.push(errorMsg);
    createTimedError();
}

function createTimedError() {
    closeErrors();

    errorContainer.insertAdjacentHTML('beforeend', `
    <div class='errorMsg'>
    <h2>Błąd</h2>
    <div>
    <a>`  + errorMessages[0] + `</a>
    </div>
    </div>`)
    errorContainer.classList.add("shown")

    clearTimeout(errorTimer);
    errorTimer = setTimeout(function () {
        closeErrors()
    }, 10000)
}

function closeErrors() {
    errors = document.getElementsByClassName('errorMsg')

    Array.prototype.forEach.call(errors, function (error) {
        error.remove();
    })

    errorContainer.classList.remove("shown")
}