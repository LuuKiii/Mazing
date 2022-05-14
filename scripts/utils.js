function getRadioValue(radio) {
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked)
            return radio[i].value
    }
    return null;
}

function setVarsByMazeType() {
    switch (mazeType) {
        case 'stroke':
            ctx.strokeStyle = '#000';
            gridTypeChange('basic');
            break;
        case 'fill':
            switch (drawFillType) {
                case 'empty':
                    ctx.strokeStyle = '#b4b6b8'
                    gridTypeChange('path');
                    break;
                case 'filled':
                    ctx.strokeStyle = '#b4b6b8'
                    gridTypeChange('wall');
                    break;
            }
            break;
    }
}

function nullPathVariables() {
    startTileIndex = null;
    destinationTileIndex = null;
    openSet = [];
    closedSet = [];

    mouseModeChange('none');
}

function resetPathfinding() {
    nullPathVariables();
    updatePointChecksView(true);
    setVarsByMazeType();
    eventEnabler();
    buttonState(createMethod === 'draw' ? 'draw' : 'beforePathfinding');
}

function resetGlobals() {
    current = null;
    tilesVisited = [];
    currentPathHead = null;

    nullPathVariables();
    applySettings();
}