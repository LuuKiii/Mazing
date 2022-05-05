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
    onClickPos.mouse.x = getMousePos(event).x;
    onClickPos.mouse.y = getMousePos(event).y;
    document.getElementById("coords2").innerHTML = (onClickPos.mouse.x + " " + onClickPos.mouse.y);
    modeSwitch();
}

function updateMouseDis(event) {
    let coords = getMousePos(event);
    let coor = coords.x + "  " + coords.y;
    tileHoveredOver();
    document.getElementById("coords").innerHTML = coor;

}

//====================== EVENT HANDLING =====================
//activates listeneres
function mouseEventHander() {
    canvas.addEventListener("mousemove", updateMouseDis, false);
    canvas.addEventListener("click", updateOnClickPos, false);
}

function eventDisabler() {
    canvas.removeEventListener("mousemove", updateMouseDis, false);
    canvas.removeEventListener("click", updateOnClickPos, false);

    pathfindingBtn.disabled = true;
    generateBtn.disabled = true;
}

//================ MOUSE MODES ===============
function modeSwitch() {
    switch (mouseMode) {
        case 'startPoint':
            console.log('start');
            break;
        case 'endPoint':
            console.log('end');
            break;
        case 'drawWall':
            console.log('draw');
            break;
        case 'drawPath':
            console.log('erase');
            break;
    }
}