//Functions shared between multiple algos

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