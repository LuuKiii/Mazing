class TileRatingDijkstraOld {
    constructor(index, pindex, g) {
        this.index = index; // must be equal to Tiles index in grid;
        this.parentIndex = pindex;
        this.g = g;
        this.overWriteType = 'none';
        this.overWriteColor = null;
    }
}

TileRatingDijkstraOld.prototype.overWriteTypeChange = function (toType) {
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

function createDSetOld(){
    for(i = 0; i < grid.length; i++) {
        let ratingObj = new TileRatingDijkstraOld(grid[i].index, grid[i].index, Number.MAX_VALUE)
        dSet[i] = ratingObj;
    }
}

function setPathfindingVariablesDijkstraOld() {
    createDSetOld();
    let TileRated = new TileRatingDijkstraOld(startTileIndex, startTileIndex, 0);
    dSetOperator('update', TileRated);

}

//dSet functions

function dSetOperator(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('openList');
            return dSet.push(object);
        case 'pop':
            let dSetEl = dSet.pop();
            dSetEl.overWriteTypeChange('none');
            return dSetEl;
        case 'returnNotInVset':
            for(const dSetEl of dSet){
                if(!isInVSet(dSetEl.index)){
                    return dSetEl;
                }
            }
            break;
        case 'update':
            let ind = findDSetIndex(object.index);
            dSet[ind] = object;
           
            return;
        case 'updateNeighbour':
            object.overWriteTypeChange('openList');
            let ind2 = findDSetIndex(object.index);
            dSet[ind2] = object;
    }

    return undefined;
}

function sortdSetBygValueOld() {
    let n = dSet.length;
    let tempObj;
    do {
        for (i = 0; i < n - 1; i++) {
            if (dSet[i].g > dSet[i + 1].g) {
                tempObj = dSet[i + 1];
                dSet[i + 1] = dSet[i];
                dSet[i] = tempObj;
            }
        }
        n--;
    } while (n > 1)
}

function isInDSet(index) {
    for (const dSetEl of dSet) {
        if (dSetEl.index === index) return true;
    }
    return false
}

function findDSetIndex(index) {
    for (let i = 0; i < dSet.length; i++) {
        if (dSet[i].index === index)
            return i;
    }
    return null;
}

//vSet functions

function vSetOperator(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('closedList');
            return vSet.push(object);
        case 'pop':
            object.overWriteTypeChange('none');
            return vSet.pop();
    }

    return undefined;
}

function isInVSet(index) {
    for (const vSetEl of vSet) {
        if (vSetEl.index === index) return true;
    }
    return false
}

function findIndexOfHighestgDijkstraOld() {
    let highestf = -1;
    let IndexOfHighestf = -1;

    for (i = 0; i < dSetOperator.length; i++) {
        if (highestf < dSet[i].g) {
            highestf = dSet[i].g;
            IndexOfHighestf = i;
        }
    }

    return IndexOfHighestf;
}

function getObjectFromVSet(index) {
    for (let i = 0; i < vSet.length; i++){
        if(vSet[i].index === index){
            return vSet[i]
        }
    }
    return null;
}

//Create Rating object and heuristics

function createRatingObjectDijkstraOld(neighbour, parentObj, iteration) {
    let g;

    //iteration helps determine if neighbour is diagonally adjacent or directally adjacent
    (is8Dimensions && iteration % 2 !== 0) ? g = Math.sqrt(2) + parentObj.g : g = 1 + parentObj.g;

    return new TileRatingDijkstraOld(neighbour.index, parentObj.index, g)
}

//Drawing

function drawFinalPathDijkstraOld(tileRatingObj) {
    pathLength++;

    console.log(tileRatingObj)
    tileRatingObj.overWriteTypeChange('endPath');
    if(tileRatingObj.index === startTileIndex) return;

    let parentObj = getObjectFromVSet(tileRatingObj.parentIndex);
    drawFinalPathDijkstraOld(parentObj);
}

function isFinalPathDijkstraOld() {
    if(currentPathHead.index === destinationTileIndex) return true;
    return false;
}

// Dijkstra

function dijkstraOldAlgorithm() {
    if (dSet.length === vSet.length) return true;

    sortdSetBygValueOld();

    
    currentPathHead = dSetOperator('returnNotInVset');
    vSetOperator('push', currentPathHead);
    let tileIndex = currentPathHead.index;

    if (tileIndex === destinationTileIndex) return true;

    let iteration = -1;
    for (const neighbour of grid[tileIndex].neighboursList) {
        iteration++;
        if (!neighbour) continue;
        if (isObstacle(neighbour, tileIndex, iteration)) continue;
        if (isInVSet(neighbour.index)) continue;

        let updatedRatingObj = createRatingObjectDijkstraOld(neighbour, currentPathHead, iteration)

        let foundIndex = findDSetIndex(updatedRatingObj.index);
        if (dSet[foundIndex].g > updatedRatingObj.g){
            dSetOperator('updateNeighbour',updatedRatingObj)
        }

    }

    return false;
}