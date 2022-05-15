//====================MOUSE LOCATION ON CANVAS ====================
//constantly gets mouse x,y coordinates when within canvas
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

//Stores mouse coordinations when mouse is clicked
const onClickPos = {
    mouse: {
        x: 0,
        y: 0
    }
}

// ====================== EVENT UPDATES ====================
function updateOnClickPos(event) {
    // onClickPos.mouse.x = getMousePos(event).x;
    // onClickPos.mouse.y = getMousePos(event).y;
    // document.getElementById("coords2").innerHTML = (onClickPos.mouse.x + " " + onClickPos.mouse.y);
    mouseClickOperation();
}

function updateMouseDis(event) {
    // let coords = getMousePos(event);
    // let coor = coords.x + "  " + coords.y;
    tileHoveredOver();
    // document.getElementById("coords").innerHTML = coor;

}

function updateOnLeave() {
    tileHoveredOver(true);
}

function updateisDown(){
    isHeldDown = true;
}

function updateisUp() {
    isHeldDown = false;
}

function updateDraw() {
    if(!isHeldDown) return;

    let toType = mouseMode === 'drawWall' ? 'wall' : 'path';

    try {
        if(grid[highLightedTileIndex].type !== toType){
            grid[highLightedTileIndex].typeChange(toType);
            
        }
    } catch (error) {
        isHeldDown = false;   
    }
}
//====================== EVENT HANDLING =====================
//activates listeneres
function eventEnabler() {
    canvas.addEventListener("mousemove", updateMouseDis, false);
    canvas.addEventListener("click", updateOnClickPos, false);
    canvas.addEventListener("mouseleave", updateOnLeave, false);
}

function eventDisabler() {
    canvas.removeEventListener("mousemove", updateMouseDis, false);
    canvas.removeEventListener("click", updateOnClickPos, false);
    canvas.removeEventListener("mouseleave", updateOnLeave, false);

    mouseModeChange('none');
}

//drawing
function drawing(buttonToActivate) {
        canvas.addEventListener("mousemove", updateDraw, false)
        canvas.addEventListener("mousedown", updateisDown, false); 
        canvas.addEventListener("mouseleave", updateisUp, false); 
        canvas.addEventListener("mouseup", updateisUp, false);

        drawButtonsUpdate('activate', buttonToActivate)
}

function disableDrawing() {
    isHeldDown = false;
    canvas.removeEventListener("mousemove", updateDraw, false)
    canvas.removeEventListener("mousedown", updateisDown, false); 
    canvas.removeEventListener("mouseleave", updateisUp, false); 
    canvas.removeEventListener("mouseup", updateisUp, false);
}
//================ MOUSE MODES ===============
function mouseModeChange(mouseModeType){
    drawButtonsUpdate('deactivate');

    mouseMode = mouseModeType;
    if(mazeType === 'stroke'){
        switch (mouseMode) {
            case 'startPoint':
                highlightColor = 'rgba(0, 150, 0, 0.2)';
                break;
            case 'endPoint':
                highlightColor = 'rgba(150, 0, 0, 0.2)';
                break;
            case 'drawWall':
                highlightColor = 'rgba(50, 0, 0, 0.2)';
                break;
            case 'drawPath':
                highlightColor = 'rgba(50, 0, 0, 0.2)';
                break;
            case 'none':
                highlightColor = 'rgba(50, 0, 0, 0.2)';
                break;
        }
    } else {
        switch (mouseMode) {
            case 'startPoint':
                highlightColor = 'rgba(0, 150, 0, 0.6)';
                break;
            case 'endPoint':
                highlightColor = 'rgba(150, 0, 0, 0.6)';
                break;
            case 'drawWall':
                highlightColor = 'rgba(200, 200, 200, 0.6)';
                drawing('drawWall');
                break;
            case 'drawPath':
                highlightColor = 'rgba(200, 200, 200, 0.6)';
                drawing('drawPath');
                break;
            case 'none':
                highlightColor = 'rgba(200, 200, 200, 0.6)';
                break;
        }
    }
}

//============= Mouse Operation
function mouseClickOperation() {
    if(!grid[highLightedTileIndex]) return;
    let tempTilePoints;

    switch (mouseMode) {
        case 'startPoint':
            tempTilePoints = createPoint('startPoint', startTileIndex, destinationTileIndex);
            setStartPoint(tempTilePoints);
            updatePointChecksView(false);
            break;
        case 'endPoint':
            tempTilePoints = createPoint('endPoint', destinationTileIndex, startTileIndex);
            setEndPoint(tempTilePoints);
            updatePointChecksView(false);
            break;
        case 'drawWall':
            grid[highLightedTileIndex].typeChange('wall')
            break;
        case 'drawPath':
            grid[highLightedTileIndex].typeChange('path')
            break;
    }
}


function createPoint(pointType, pointToSet, otherPoint){
    if(pointToSet)
        grid[pointToSet].typeChange('basic');
    
    pointToSet = highLightedTileIndex;
    grid[pointToSet].typeChange(pointType);

    otherPoint === pointToSet ? otherPoint = undefined : '';
    mouseModeChange('none');

    return {
        pointToSet: pointToSet,
        otherPoint: otherPoint};
}

function setStartPoint(tempTilePoints){
    startTileIndex = tempTilePoints.pointToSet;
    destinationTileIndex = tempTilePoints.otherPoint;
}

function setEndPoint(tempTilePoints){
    startTileIndex = tempTilePoints.otherPoint;
    destinationTileIndex = tempTilePoints.pointToSet;
}


//================== MOUSE GRID OPERATIONS================

//Selecting tile functions

//needs to have a value since its being compared to at the beggining

function tileHoveredOver(isMouseOutofBounds) {
    let tempX, tempY

    try{
        tempX = Math.floor(getMousePos(event).x/tileSide);
        tempY = Math.floor(getMousePos(event).y/tileSide);

        highLightedTileIndex = (tempX) + (tempY)*gridRows;

        if(isMouseOutofBounds) highLightedTileIndex = -1;

        if(highLightedTileIndex != previousHighLightedTileIndex){
            //restore basic color of the tile
            grid[previousHighLightedTileIndex].draw(); 
            previousHighLightedTileIndex = highLightedTileIndex; 
            ctx.fillStyle = highlightColor;
            grid[highLightedTileIndex].drawBackgroundColor();
        }
        
    }catch(error){
        //reset the coords when outofbounds to 0
        previousHighLightedTileIndex = 0;
    }

}




// let previouslySelected = -1;

// function tileClicked() {

//     if(previouslySelected > -1){
//         grid[previouslySelected].currentBaseColor = "#cff2ff";
//         grid[previouslySelected].draw();
//     }
    

//     previouslySelected = highLightedTileIndex;
//     grid[highLightedTileIndex].currentBaseColor = 'rgba(255, 0, 0, 0.75)';
//     current = highLightedTileIndex;
// }