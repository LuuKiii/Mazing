function getRadioValue(radio){
    for(let i = 0; i < radio.length; i++){
        if(radio[i].checked)
            return radio[i].value
    }
    return null;
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