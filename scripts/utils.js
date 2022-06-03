function getRadioValue(radio) {
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked)
            return radio[i].value
    }
    return null;
}

function setVarsByMazeType(leaveTypes = []) {
    switch (mazeType) {
        case 'stroke':
            ctx.strokeStyle = '#000';
            gridTypeChange('basic');
            break;
        case 'fill':
            switch (drawFillType) {
                case 'empty':
                    ctx.strokeStyle = '#b4b6b8'
                    gridTypeChange('path', leaveTypes);
                    break;
                case 'filled':
                    ctx.strokeStyle = '#b4b6b8'
                    gridTypeChange('wall', leaveTypes, ['startPoint', 'endPoint']);
                    break;
            }
            break;
    }
}

function resetGlobals() {
    current = null;
    tilesVisited = [];
    currentPathHead = null;

    nullPathVariables();
    applySettings();
}

function startEndTileSelector() {
    startTileIndex = startTileIndex ?? 0;
    destinationTileIndex = destinationTileIndex ?? grid.length - 1;
    grid[startTileIndex].typeChange('startPoint');
    grid[destinationTileIndex].typeChange('endPoint');
}