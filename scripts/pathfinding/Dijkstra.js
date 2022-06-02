//Dijkstra algoritm but made with diffrent, way more time consuming aproach.
//Left for testing, actually used code is from astar with zeroing heuristic.
class TileRatingD {
    constructor(index, pindex, cost) {
        this.index = index; // must be equal to Tiles index in grid;
        this.parentIndex = pindex;
        this.cost = cost;
    }
}

TileRatingD.prototype.updateValues = function (pindex, cost) {
    this.parentIndex = pindex;
    this.cost = cost;
}

TileRatingD.prototype.overWriteTypeChange = function (toType) {
    if (this.index === startTileIndex || this.index === destinationTileIndex) return;
    let overWriteColor;

    switch (toType) {
        case 'checked':
            overWriteColor = '#62bf7b';
            break;
        case 'stpSet':
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

function createInitalSets() {
    distSet = [];
    sptSet = [];

    for (let i = 0; i < grid.length; i++) {
        distSet[i] = new TileRatingD(i, -1, Number.MAX_VALUE);
    }

    distSet[startTileIndex].updateValues(startTileIndex, 0);
}

//Find and Sort
function sortDistSetByCost() {
    let n = distSet.length;
    let tempObj;
    do {
        for (i = 0; i < n - 1; i++) {
            if (distSet[i].cost > distSet[i + 1].cost) {
                tempObj = distSet[i + 1];
                distSet[i + 1] = distSet[i];
                distSet[i] = tempObj;
            }
        }
        n--;
    } while (n > 1)
}

function isInSptSet(index) {
    for (const sptEl of sptSet) {
        if (sptEl.index === index) return true;
    }
    return false;
}

function findLowestNotVisitedCostInDistSet() {
    for (i = 0; i < distSet.length; i++) {
        if (distSet[i].cost === Number.MAX_VALUE) {
            console.warn('Entered bad values!')
            return null;
        }
        if (!isInSptSet(distSet[i].index))
            return i;
    }
}

function findInDistSet(index) {
    for (i = 0; i < distSet.length; i++) {
        if (distSet[i].index === index) return i;
    }
}

function getParenObj(pindex) {
    return distSet.find(el => el.index === pindex)
}

// SptSet

function updateSpt(currentPathDHead) {
    sptSet.push(currentPathDHead);
    distSet[findInDistSet(currentPathDHead.index)].overWriteTypeChange('stpSet');
}

// Other

function updateRatingObject(neighbour, tileIndex) {
    cost = distSet[findInDistSet(tileIndex)].cost + 1;
    if (cost < distSet[findInDistSet(neighbour.index)].cost) {
        distSet[findInDistSet(neighbour.index)].updateValues(tileIndex, cost);
        distSet[findInDistSet(neighbour.index)].overWriteTypeChange('checked');
    }
}

function isFinalPathD() {
    if(currentPathDHead.index === destinationTileIndex) return true;
    return false;
}

function drawFinalPathD(tileRatingObj) {
    pathLength++;

    tileRatingObj.overWriteTypeChange('endPath')
    if(tileRatingObj.index === startTileIndex) return;

    let parentObj = getParenObj(tileRatingObj.parentIndex);
    drawFinalPathD(parentObj);
}
//Dijkstra

function dijkstraAlgorithm() {
    if (distSet.length === sptSet.length) return true;

    sortDistSetByCost();
    currentPathDHead = distSet[findLowestNotVisitedCostInDistSet()];
    updateSpt(currentPathDHead);


    let tileIndex = currentPathDHead.index;
    if (tileIndex === destinationTileIndex) return true;

    let iteration = -1
    for (const neighbour of grid[tileIndex].neighboursList) {
        iteration++;
        if (!neighbour) continue;
        if (isObstacle(neighbour, tileIndex, iteration)) continue;


        updateRatingObject(neighbour, tileIndex);
    }

    return false;
}