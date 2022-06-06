class TileRatingGreedy {
    constructor(index, pindex, h, visited) {
        this.index = index; // must be equal to Tiles index in grid;
        this.parentIndex = pindex;
        this.h = h;
        this.visited = visited;
        this.overWriteType = 'none';
        this.overWriteColor = null;
    }
}

TileRatingGreedy.prototype.overWriteTypeChange = function (toType) {
    if(this.index === startTileIndex || this.index === destinationTileIndex) return;
    let overWriteColor;

    switch (toType) {
        case 'queue':
            overWriteColor = '#62bf7b';
            break;
        case 'visited':
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

//CREATING

function setPathfindingVariablesGreedy() {
    queue = [];
    visited = [];
    let createdObj = createRatingObjectGreedy(startTileIndex, startTileIndex, true);
    queueOperatorGreedy('push',createdObj);
    visitedOperator('push', createdObj);
}

function createRatingObjectGreedy(neighbourIndex, parentObjIndex, isVisited = false) {
    let h;

    h = is8Dimensions ? diagonalDistanceGreedy(neighbourIndex, destinationTileIndex) : manhattanDistanceGreedy(neighbourIndex, destinationTileIndex);

    return new TileRatingGreedy(neighbourIndex, parentObjIndex, h, isVisited)
}

function manhattanDistanceGreedy(objAindex, objBindex) {
    return Math.abs(grid[objAindex].positionX / tileSide - grid[objBindex].positionX / tileSide) + Math.abs(grid[objAindex].positionY / tileSide - grid[objBindex].positionY / tileSide);
}

function diagonalDistanceGreedy(objAindex, objBindex) {
    let dx = Math.abs(grid[objAindex].positionX / tileSide - grid[objBindex].positionX / tileSide)
    let dy = Math.abs(grid[objAindex].positionY / tileSide - grid[objBindex].positionY / tileSide)
    let a = 1;
    let sqrA = a * Math.sqrt(2);

    return a * (dx + dy) + (sqrA - 2 * a) * Math.min(dx, dy)
}

//SORTING AND CHECKING

function isInVisited(index) {
    for (const visitedElement of visited) {
        if (visitedElement.index === index) return true;
    }
    return false
}

//Queue
function sortQueueByH() {
    let n = queue.length;
    let tempObj;
    do {
        for (i = 0; i < n - 1; i++) {
            if (queue[i].h < queue[i + 1].h) {
                tempObj = queue[i + 1];
                queue[i + 1] = queue[i];
                queue[i] = tempObj;
            }
        }
        n--;
    } while (n > 1)
}

function findInQueueIndex(objIndex) {
    for (let i = 0; i < queue.length; i++) {
        if (queue[i].index === objIndex)
            return i;
    }
    return null;
}

function queueOperatorGreedy(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('queue');
            return queue.push(object);
        case 'pop':
            let queueEl = queue.pop();
            queueEl.overWriteTypeChange('visited');
            return queueEl;
    }

    return undefined;
}
//Visited
function visitedOperator(action, object) {
    switch (action) {
        case 'push':
            object.overWriteTypeChange('visited');
            return visited.push(object);
        case 'pop':
            object.overWriteTypeChange('none');
            return visited.pop();
    }

    return undefined;
}

function getObjectFromVisited(index) {
    for (let i = 0; i < visited.length; i++){
        if(visited[i].index === index){
            return visited[i];
        }
    }
    return null;
}

//DRAWING

function drawFinalPathGreedy(tileRatingObj) {
    pathLength++;

    tileRatingObj.overWriteTypeChange('endPath');
    if(tileRatingObj.index === startTileIndex) return;

    let parentObj = getObjectFromVisited(tileRatingObj.parentIndex);
    drawFinalPathGreedy(parentObj);
}

function isFinalPathGreedy() {
    if(currentPathHead.index === destinationTileIndex) return true;
    return false;
}

//GREEDY BFS
function greedyBFSAlgorithm() {
    if(queue.length === 0) return  true;

    
        sortQueueByH();
        currentPathHead = queueOperatorGreedy('pop')
        let iteration = -1;
        for (const neighbour of grid[currentPathHead.index].neighboursList) {
            iteration++;
            if (!neighbour) continue;
            if (isObstacle(neighbour, currentPathHead.index , iteration)) continue;

            if (isInVisited(neighbour.index) === false) {
                if (neighbour.index === destinationTileIndex) {
                    createdObj = createRatingObjectGreedy(neighbour.index, currentPathHead.index, true);
                    currentPathHead = createdObj;
                    return true;
                } else {
                    createdObj = createRatingObjectGreedy(neighbour.index, currentPathHead.index, true)
                    visitedOperator('push', createdObj)
                    queueOperatorGreedy('push', createdObj)
                }
            }
        }
    

    return false;
}