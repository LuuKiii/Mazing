

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
    tileClicked();
    document.getElementById("coords2").innerHTML = (onClickPos.mouse.x + " " + onClickPos.mouse.y);
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