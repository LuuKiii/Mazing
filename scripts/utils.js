function getRadioValue(radio){
    for(let i = 0; i < radio.length; i++){
        if(radio[i].checked)
            return radio[i].value
    }
    return null;
}

function setVarsByMazeType(){
    switch(mazeType){
        case 'stroke':
            ctx.strokeStyle ='#000';
            gridTypeChange('basic');
            break;
        case 'fill':
            ctx.strokeStyle = '#b4b6b8'
            gridTypeChange('wall');
            break;
    }
}

function nullPathVariables(){
    startTileIndex = null;
    destinationTileIndex = null;
    openSet = [];
    closedSet = [];
}

function resetPathfinding(){
    nullPathVariables();

    gridTypeChange('basic')
    eventEnabler();
    buttonState('beforePathfinding');
}

function resetGlobals() {
    current = null;
    tilesVisited = [];
    currentPathHead = null;

    nullPathVariables();
    applySettings();
}