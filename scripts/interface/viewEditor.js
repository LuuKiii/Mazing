let isCollapsed = true;

function toggleMenu() {
    isCollapsed = !isCollapsed;
}

menu.addEventListener("click", () => {
    let content = menu.nextElementSibling;
    toggleMenu();
    if (isCollapsed) {
        content.style.visibility = "hidden";
        content.classList.remove('unfolded');
    } else {
        content.style.visibility = "visible"
        content.classList.add('unfolded');
    }
});

function onDelayChange() {
    mazeGenerateDelay = Number(delayInput.value) * 200;
}

function onRadioChange() {
    if (buttonsObj.radio.mazeTypeBtn[1].checked) {
        if(buttonsObj.radio.createMethodBtn[1].checked){
            buttonRadiosToBeActive(['mazeTypeBtn', 'createMethodBtn','isFilledBtn']);
        }else{
            buttonRadiosToBeActive(['mazeTypeBtn', 'createMethodBtn']);
        }
    } else {
        buttonsObj.radio.createMethodBtn[0].checked = true;
        buttonRadiosToBeActive(['mazeTypeBtn'])
    }
}

function updatePointChecksView(toNull) {
    if(toNull){
        startTileIndex = null;
        destinationTileIndex = null;
    }

    if (!startTileIndex) {
        document.getElementById('startPointCheck').innerHTML = 'Nie wybrano';
    } else {
        document.getElementById('startPointCheck').innerHTML = 'Wybrano';
    }

    if (!destinationTileIndex) {
        document.getElementById('endPointCheck').innerHTML = 'Nie wybrano';
    } else {
        document.getElementById('endPointCheck').innerHTML = 'Wybrano';
    }
}

function drawButtonsUpdate(action){
    switch(action){
        case 'activate': 
            if(mouseMode === 'drawWall'){
                buttonsObj.drawWallBtn.classList.add('activated');
            }
            if(mouseMode === 'drawPath'){
                buttonsObj.drawPathBtn.classList.add('activated');
            }
            break;
        case 'deactivate':
            if(mouseMode === 'drawWall'){
                disableDrawing();
                buttonsObj.drawWallBtn.classList.remove('activated');
            }
            if( mouseMode === 'drawPath'){
                disableDrawing();
                buttonsObj.drawPathBtn.classList.remove('activated');
            }
            break;
    }
}

function buttonState(state) {
    switch (state) {
        case 'inital':
            buttonsToBeActive(['startPointBtn', 'applyBtn', 'generateBtn', 'resetGlobalsBtn', 'mazeTypeBtn']);
            break;
        case 'block-inital':
            buttonsToBeActive(['startPointBtn', 'applyBtn', 'generateBtn', 'resetGlobalsBtn', 'mazeTypeBtn', 'createMethodBtn']);
            break;
        case 'beforePathfinding':
            buttonsToBeActive(['startPointBtn', 'endPointBtn', 'resetGlobalsBtn', 'pathfindingBtn']);
            break;
        case 'draw':
            buttonsToBeActive(['startPointBtn', 'endPointBtn', 'drawWallBtn', 'drawPathBtn', 'applyBtn', 'pathfindingBtn', 'resetGlobalsBtn', 'mazeTypeBtn', 'createMethodBtn', 'isFilledBtn']);
            break;
        case 'end':
            buttonsToBeActive(['resetPathfindingBtn', 'resetGlobalsBtn']);
            break;
        case 'off':
            buttonsToBeActive([]);
            break;
    }
}

function buttonsToBeActive(toStayActive) {
    for (const [key, value] of Object.entries(buttonsObj)) {
        if (key == 'radio') continue;
        if (toStayActive.indexOf(key) !== -1) {
            value.disabled = false;
            continue;
        }

        value.disabled = true;
    }

    buttonRadiosToBeActive(toStayActive);
}

function buttonRadiosToBeActive(toStayActive) {
    for (const [key, value] of Object.entries(buttonsObj.radio)) {
        try {
            value.forEach(instanceOfRadio => {
                if (toStayActive.indexOf(key) !== -1) {
                    instanceOfRadio.disabled = false;
                } else {
                    instanceOfRadio.disabled = true;
                }
            })
        } catch (error) {
            console.warn('Assigned non radio type button to radio object')
        }
    }
}