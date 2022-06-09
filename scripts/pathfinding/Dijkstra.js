class TileRatingDijkstra {
    constructor(index, pindex, g) {
        this.index = index; // must be equal to Tiles index in grid;
        this.parentIndex = pindex;
        this.g = g;
        this.overWriteType = 'none';
        this.overWriteColor = null;
    }
}

TileRatingDijkstra.prototype.overWriteTypeChange = function (toType) {
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

function setPathfindingVariablesDijkstra() {
    let TileRated = new TileRatingDijkstra(startTileIndex, startTileIndex, 0);
    openSetOperatorDijkstra('push', TileRated);
}

//OpenSet functions

function openSetOperatorDijkstra(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('openList');
            return openSet.push(object);
        case 'pop':
            let openSetEl = openSet.pop();
            openSetEl.overWriteTypeChange('none');
            return openSetEl;
    }

    return undefined;
}

function sortOpenSetByfValueDijkstra() {
    let n = openSet.length;
    let tempObj;
    do {
        for (i = 0; i < n - 1; i++) {
            if (openSet[i].g < openSet[i + 1].g) {
                tempObj = openSet[i + 1];
                openSet[i + 1] = openSet[i];
                openSet[i] = tempObj;
            }
        }
        n--;
    } while (n > 1)
}

function isInOpenSetDijkstra(index) {
    for (const openSetEl of openSet) {
        if (openSetEl.index === index) return true;
    }
    return false
}

function findOpenSetIndexDijkstra(index) {
    for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].index === index)
            return i;
    }
    return null;
}

//ClosedSet functions

function closedSetOperatorDijkstra(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('closedList');
            return closedSet.push(object);
        case 'pop':
            object.overWriteTypeChange('none');
            return closedSet.pop();
    }

    return undefined;
}

function isInClosedSetDijkstra(index) {
    for (const closedSetEl of closedSet) {
        if (closedSetEl.index === index) return true;
    }
    return false
}

function findIndexOfHighestfDijkstra() {
    let highestf = -1;
    let IndexOfHighestf = -1;

    for (i = 0; i < openSet.length; i++) {
        if (highestf < openSet[i].g) {
            highestf = openSet[i].g;
            IndexOfHighestf = i;
        }
    }

    return IndexOfHighestf;
}

function getObjFromClosedSetDijkstra(index) {
    for (let i = 0; i < closedSet.length; i++){
        if(closedSet[i].index === index){
            return closedSet[i]
        }
    }
    return null;
}

//Create Rating object and heuristics

function createRatingObjectDijkstra(neighbour, parentObj, iteration) {
    let g;

    //iteration helps determine if neighbour is diagonally adjacent or directally adjacent
    (is8Dimensions && iteration % 2 !== 0) ? g = Math.sqrt(2) + parentObj.g : g = 1 + parentObj.g;

    return new TileRatingDijkstra(neighbour.index, parentObj.index, g)
}

//Drawing

function drawFinalPathDijkstra(tileRatingObj) {
    pathLength++;

    tileRatingObj.overWriteTypeChange('endPath');
    if(tileRatingObj.index === startTileIndex) return;

    let parentObj = getObjFromClosedSetDijkstra(tileRatingObj.parentIndex);
    drawFinalPathDijkstra(parentObj);
}

function isFinalPathDijkstra() {
    if(currentPathHead.index === destinationTileIndex) return true;
    return false;
}

// Dijkstra

function dijkstraAlgorithm() {
    if (openSet.length === 0) return true;

    sortOpenSetByfValueDijkstra();
    currentPathHead = openSetOperatorDijkstra('pop');
    closedSetOperatorDijkstra('push', currentPathHead);

    let tileIndex = currentPathHead.index;

    if (tileIndex === destinationTileIndex) return true;

    let iteration = -1;
    for (const neighbour of grid[tileIndex].neighboursList) {
        iteration++;
        if (!neighbour) continue;
        if (isObstacle(neighbour, tileIndex, iteration)) continue;
        if (isInClosedSetDijkstra(neighbour.index)) continue;

        let newRatingObj = createRatingObjectDijkstra(neighbour, currentPathHead, iteration)

        if (isInOpenSetDijkstra(newRatingObj.index)) {
            let foundIndex = findOpenSetIndexDijkstra(newRatingObj.index);
            if (openSet[foundIndex].g > newRatingObj.g)
                openSet[foundIndex] = newRatingObj;
            continue;
        }
        openSetOperatorDijkstra('push', newRatingObj);
    }

    return false;
}