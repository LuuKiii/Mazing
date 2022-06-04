//Functions shared between multiple algos
//Modular obstacle for both maze types, requires more info
function isObstacle(neighbour, currentIndex, wallIndex) {
    switch (mazeType) {
        case 'stroke':
            if (grid[currentIndex].walls[wallIndex] === true) {
                return true;
            }
            return false;
        case 'fill':
            if (neighbour.type === 'wall') {
                return true;
            }
            return false;
    }
}

//Obstacle only for fill types
function isObstacleByIndex (currentIndex) {
    if(grid[currentIndex].type === 'wall') return true;
    return false;
}

function nullPathVariables() {
    startTileIndex = null;
    destinationTileIndex = null;
    openSet = [];
    closedSet = [];
    openSetJPS = [];
    closedSetJPS = [];

    mouseModeChange('none');
}

function resetPathfinding() {
    nullPathVariables();
    updatePointChecksView(true);
    setVarsByMazeType(createMethod === 'draw' ? drawFillType === 'empty' ? ['wall'] : ['path'] : []);
    eventEnabler();
    buttonState(createMethod === 'draw' ? 'draw' : 'beforePathfinding');
}