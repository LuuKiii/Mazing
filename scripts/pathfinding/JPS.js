class TileRatingJPS {
    constructor(index, pindex, h, g = 1) {
        this.index = index; // must be equal to Tiles index in grid;
        this.parentIndex = pindex;
        this.h = h;
        this.g = g;
        this.f = g + h;
        this.overWriteType = 'none';
        this.overWriteColor = null;
    }
}

TileRatingJPS.prototype.overWriteTypeChange = function (toType) {
    if(this.index === startTileIndex || this.index === destinationTileIndex) return;
    let overWriteColor;

    switch (toType) {
        case 'openList':
            overWriteColor = '#62bf7b';
            break;
        case 'closedList':
            overWriteColor = '#db707b';
            break;
        case 'endPath':
            overWriteColor = '#c4bc66';
            break;
        case 'none':
            overWriteColor = null;
            break;
    }

    grid[this.index].overWriteColor(overWriteColor);
}

function setJPSVariables() {
    let TileRated = new TileRatingJPS(startTileIndex ?? 0, startTileIndex ?? 0, 0, 0);
    openSetOperatorJPS('push', TileRated);
    destinationTileIndex = destinationTileIndex ?? grid.length - 1;
}

//OpenSet functions

function openSetOperatorJPS(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('openList');
            return openSetJPS.push(object);
        case 'pop':
            let openSetEl = openSetJPS.pop();
            openSetEl.overWriteTypeChange('none');
            return openSetEl;
    }

    return undefined;
}

function sortOpenSetByfValueJPS() {
    let n = openSetJPS.length;
    let tempObj;
    do {
        for (i = 0; i < n - 1; i++) {
            if (openSetJPS[i].f < openSetJPS[i + 1].f) {
                tempObj = openSetJPS[i + 1];
                openSetJPS[i + 1] = openSetJPS[i];
                openSetJPS[i] = tempObj;
            }
        }
        n--;
    } while (n > 1)
}

function isInOpenSetJPS(index) {
    for (const openSetEl of openSetJPS) {
        if (openSetEl.index === index) return true;
    }
    return false
}

function findOpenSetIndexJPS(index) {
    for (let i = 0; i < openSetJPS.length; i++) {
        if (openSetJPS[i].index === index)
            return i;
    }
    return null;
}

//ClosedSet functions

function closedSetOperatorJPS(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('closedList');
            return closedSetJPS.push(object);
        case 'pop':
            object.overWriteTypeChange('none');
            return closedSetJPS.pop();
    }

    return undefined;
}

function isInClosedSetJPS(index) {
    for (const closedSetEl of closedSetJPS) {
        if (closedSetEl.index === index) return true;
    }
    return false
}

function findIndexOfHighestfJPS() {
    let highestf = -1;
    let IndexOfHighestf = -1;

    for (i = 0; i < openSetJPS.length; i++) {
        if (highestf < openSetJPS[i].f) {
            highestf = openSetJPS[i].f;
            IndexOfHighestf = i;
        }
    }

    return IndexOfHighestf;
}

function getObjFromClosedSetJPS(index) {
    for (let i = 0; i < closedSetJPS.length; i++){
        if(closedSetJPS[i].index === index){
            return closedSetJPS[i]
        }
    }
    return null;
}

//Other

function createRatingObjectJPS(neighbour, parentObj, iteration) {
    let g, h;

    //iteration helps determine if neighbour is diagonally adjacent or directally adjacent
    g = 1.4 + parentObj.g

    //null heuristic if dijkstra
    h = manhattanDistanceJPS(neighbour.index, destinationTileIndex);

    return new TileRating(neighbour.index, parentObj.index, h, g)
}

function manhattanDistanceJPS (objAindex, objBindex){
    return Math.abs(grid[objAindex].positionX/tileSide - grid[objBindex].positionX/tileSide) + Math.abs(grid[objAindex].positionY/tileSide - grid[objBindex].positionY/tileSide);
}

function diagonalDistanceJPS (objAindex, objBindex){
    return Math.sqrt((grid[objAindex].positionX/tileSide - grid[objBindex].positionX/tileSide) ** 2 + (grid[objAindex].positionY/tileSide - grid[objBindex].positionY/tileSide) ** 2);
}

// Drawing

function drawFinalPathJPS(tileRatingObj) {
    pathLength++;

    tileRatingObj.overWriteTypeChange('endPath');
    if(tileRatingObj.index === startTileIndex) return;

    let parentObj = getObjFromClosedSetJPS(tileRatingObj.parentIndex);
    drawFinalPathJPS(parentObj);
}

function isFinalPathJPS() {
    if(currentPathHeadJPS.index === destinationTileIndex) return true;
    return false;
}
// JPS

//WORK IN PROGRESS//

function identifySuccessors(current, start, end) {
    let successors = 0;
    let neighbours = 0;
}
//WORK IN PROGRESS//
function JPSAlgorithm() {
    if (openSetJPS.length === 0) return true;

    sortOpenSetByfValueJPS();
    currentPathHeadJPS = openSetOperatorJPS('pop');
    closedSetOperatorJPS('push', currentPathHeadJPS);

    let tileIndex = currentPathHeadJPS.index;

    if (tileIndex === destinationTileIndex) return true;

    let iteration = -1;
    for (const neighbour of grid[tileIndex].neighboursList) {
        iteration++;
        if (!neighbour) continue;
        if (isObstacle(neighbour, tileIndex, iteration)) continue;
        if (isInClosedSetJPS(neighbour.index)) continue;

        let newRatingObj = createRatingObjectJPS(neighbour, currentPathHeadJPS, iteration)

        if (isInOpenSetJPS(newRatingObj.index)) {
            let foundIndex = findOpenSetIndexJPS(newRatingObj.index);
            if (openSetJPS[foundIndex].g > newRatingObj.g)
                openSetJPS[foundIndex] = newRatingObj;
            continue;
        }
        openSetOperatorJPS('push', newRatingObj);
    }

    return false;
}

