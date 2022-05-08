function getRadioValue(radio){
    for(let i = 0; i < radio.length; i++){
        if(radio[i].checked)
            return radio[i].value
    }
    return null;
}


function resetPathfinding(){
    openSet = [];
    closedSet = []

    drawGrid();
}