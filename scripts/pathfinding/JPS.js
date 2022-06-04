class TileRatingJPS {
    constructor(index, pindex, h, g = 1) {
        this.index = index; // must be equal to Tiles index in grid;
        this.parentIndex = pindex;
        this.h = h;
        this.g = g;
        this.f = g + h;
        this.neighbours = [];
        this.overWriteType = 'none';
        this.overWriteColor = null;
    }
}

TileRatingJPS.prototype.overWriteTypeChange = function (toType) {
    if (this.index === startTileIndex || this.index === destinationTileIndex) return;
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
    for (let i = 0; i < closedSetJPS.length; i++) {
        if (closedSetJPS[i].index === index) {
            return closedSetJPS[i]
        }
    }
    return null;
}

//Other

function createRatingObjectJPS(neighbour, parentObj) {
    let g, h;

    //iteration helps determine if neighbour is diagonally adjacent or directally adjacent
    g = 1.4 + parentObj.g

    //null heuristic if dijkstra
    h = manhattanDistanceJPS(neighbour.index, destinationTileIndex);

    return new TileRating(neighbour.index, parentObj.index, h, g)
}

function manhattanDistanceJPS(objAindex, objBindex) {
    return Math.abs(grid[objAindex].positionX / tileSide - grid[objBindex].positionX / tileSide) + Math.abs(grid[objAindex].positionY / tileSide - grid[objBindex].positionY / tileSide);
}

function diagonalDistanceJPS(objAindex, objBindex) {
    return Math.sqrt((grid[objAindex].positionX / tileSide - grid[objBindex].positionX / tileSide) ** 2 + (grid[objAindex].positionY / tileSide - grid[objBindex].positionY / tileSide) ** 2);
}

// Drawing

function drawFinalPathJPS(tileRatingObj) {
    pathLength++;

    tileRatingObj.overWriteTypeChange('endPath');
    if (tileRatingObj.index === startTileIndex) return;

    let parentObj = getObjFromClosedSetJPS(tileRatingObj.parentIndex);
    drawFinalPathJPS(parentObj);
}

function isFinalPathJPS() {
    if (currentPathHeadJPS.index === destinationTileIndex) return true;
    return false;
}
// JPS

//WORK IN PROGRESS//
//CLASSES
class JumpPoint {
    constructor(index, pindex) {
        this.index = index // must be the same as in grid
        this.parentIndex = pindex
    }
}
// FUNCTIONS

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function pruneNeighbours(currentIndex) {
    let retList = [];

    let direction = {
        x: Number,
        y: Number
    }

    for (const neighbour of grid[currentIndex].neighboursList) {
        if (!neighbour) continue;
        if (isObstacleByIndex(neighbour.index)) continue;
        
        
        direction = { x: clamp(neighbour.positionX - grid[currentIndex].positionX, -1, 1), y: clamp(neighbour.positionY - grid[currentIndex].positionY, -1, 1) };
       

        let point = jumpPoint(neighbour, direction, grid[currentIndex])

        if(point != null)
            retList.push(point)
    }

    return retList;
}

function jumpPoint(currentPosition, direction, parent) {
    console.log('=================')
    console.log(currentPosition)
    console.log( direction)
    console.log(parent)
    console.log('=================')

    let nextPossibleJumpIndex = findNextJumpIndex(currentPosition.index, direction);


    if (isNotAdjacent(nextPossibleJumpIndex, currentPosition.index)) return null;

    if (isObstacleByIndex(nextPossibleJumpIndex)) return null;

    let ret_JumpPoint = new JumpPoint(nextPossibleJumpIndex, parent.index)

    if (ret_JumpPoint.index === destinationTileIndex) return ret_JumpPoint;

    //Checking horizontal for jumppoints// couldve shorten code to lessen number of if statments, but left it as is for readability
    if (direction.x !== 0 && direction.y === 0) {
        if (isWalkable(ret_JumpPoint.index, ret_JumpPoint.index + gridCols) === false && isWalkable(ret_JumpPoint.index, ret_JumpPoint.index + gridCols + direction.x) === true) {
            return ret_JumpPoint;
        }
        else if (isWalkable(ret_JumpPoint.index, ret_JumpPoint.index - gridCols) === false && isWalkable(ret_JumpPoint.index, ret_JumpPoint.index - gridCols + direction.x) === true) {
            return ret_JumpPoint;
        }
    }

    //Checking Verticals for jumppoints
    else if (direction.x === 0 && direction.y !== 0) {
        if (isWalkable(ret_JumpPoint.index, ret_JumpPoint.index + 1) === false && isWalkable(ret_JumpPoint.index, ret_JumpPoint.index + 1 + directionYValue(direction.y)) === true) {
            return ret_JumpPoint;
        } else if (isWalkable(ret_JumpPoint.index, ret_JumpPoint.index - 1) === false && isWalkable(ret_JumpPoint.index, ret_JumpPoint.index - 1 + directionYValue(direction.y)) === true) {
            return ret_JumpPoint;
        }
    }

    //Checking diagonals
    else if (direction.x !== 0 && direction.y !== 0) {
        if (isWalkable(ret_JumpPoint.index, ret_JumpPoint.index + direction.x) === false) {
            return ret_JumpPoint;
        } else if (isWalkable(ret_JumpPoint.index, ret_JumpPoint.index + directionYValue(direction.y)) === false) {
            return ret_JumpPoint;
        }

        if(jumpPoint(grid[nextPossibleJumpIndex], {x: direction.x, y: 0}, parent) != null
            || jumpPoint(grid[nextPossibleJumpIndex], {x: 0, y: direction.y}, parent) != null){
                return ret_JumpPoint;
            }

    }

    return jumpPoint(grid[nextPossibleJumpIndex], direction, parent);
}

function findNextJumpIndex(currentPositionIndex, direction) {

    if (direction.x == 0 && direction.y == -1) return currentPositionIndex - gridCols; //TOP
    if (direction.x == 1 && direction.y == -1) return currentPositionIndex - gridCols + 1; //TOP-RIGHT
    if (direction.x == 1 && direction.y == 0) return currentPositionIndex + 1; //RIGHT
    if (direction.x == 1 && direction.y == 1) return currentPositionIndex + gridCols + 1; //BOTTOM-RIGHT
    if (direction.x == 0 && direction.y == 1) return currentPositionIndex + gridCols; //BOTTOM
    if (direction.x == -1 && direction.y == 1) return currentPositionIndex + gridCols - 1; //BOTTOM-LEFT
    if (direction.x == -1 && direction.y == 0) return currentPositionIndex - 1; //LEFT
    if (direction.x == -1 && direction.y == -1) return currentPositionIndex - gridCols - 1; //TOP-LEFT
}

function isNotAdjacent(nextJumpIndex, currentIndex) {
    if (nextJumpIndex < 0 || nextJumpIndex >= grid.length)
        return true;

    if (currentIndex % gridCols === 0 && nextJumpIndex % gridCols === gridCols - 1)
        return true;

    if (currentIndex % gridCols === gridCols - 1 && nextJumpIndex % gridCols === 0)
        return true;

    return false;
}

function isWalkable(currentPositionIndex, potentalObstacle) {
    if (isNotAdjacent(potentalObstacle, currentPositionIndex)) return false;
    if (isObstacleByIndex(potentalObstacle)) return false;
    return true;
}

// direction registers values in -1 and +1. It works for indexing 'x' field, but 'y' field needs to be converted to establish index.
function directionYValue(y) {
    switch (y) {
        case 1:
            return gridCols;
        case -1:
            return -gridCols;
        case 0:
            return 0;
    }
}


//WORK IN PROGRESS//

function JPSAlgorithm(){
    if (openSetJPS.length === 0) return true;
    sortOpenSetByfValueJPS();
    currentPathHeadJPS = openSetOperatorJPS('pop');
    closedSetOperatorJPS('push', currentPathHeadJPS);

    let tileIndex = currentPathHeadJPS.index;
    if (tileIndex === destinationTileIndex) return true;
    let currentTileNeighboursList = pruneNeighbours(tileIndex)

    console.log(currentTileNeighboursList)
    for (const neighbour of currentTileNeighboursList){
        if (isInClosedSetJPS(neighbour.index)) continue;

        let newRatingObj = createRatingObjectJPS(neighbour, currentPathHeadJPS);

        if (isInOpenSetJPS(newRatingObj.index)) {
            let foundIndex = findOpenSetIndexJPS(newRatingObj.index);
            if (openSetJPS[foundIndex].g > newRatingObj.g)
                openSetJPS[foundIndex] = newRatingObj;
            continue;
        }
        openSetOperatorJPS('push', newRatingObj);
    }
    console.log("-----------------------------")
    return false;
}

// function JPSAlgorithmold() {
//     if (openSetJPS.length === 0) return true;

//     sortOpenSetByfValueJPS();
//     currentPathHeadJPS = openSetOperatorJPS('pop');
//     closedSetOperatorJPS('push', currentPathHeadJPS);

//     let tileIndex = currentPathHeadJPS.index;

//     if (tileIndex === destinationTileIndex) return true;

//     let iteration = -1;
//     for (const neighbour of grid[tileIndex].neighboursList) {
//         iteration++;
//         if (!neighbour) continue;
//         if (isObstacle(neighbour, tileIndex, iteration)) continue;
//         if (isInClosedSetJPS(neighbour.index)) continue;

//         let newRatingObj = createRatingObjectJPS(neighbour, currentPathHeadJPS, iteration)

//         if (isInOpenSetJPS(newRatingObj.index)) {
//             let foundIndex = findOpenSetIndexJPS(newRatingObj.index);
//             if (openSetJPS[foundIndex].g > newRatingObj.g)
//                 openSetJPS[foundIndex] = newRatingObj;
//             continue;
//         }
//         openSetOperatorJPS('push', newRatingObj);
//     }

//     return false;
// }

