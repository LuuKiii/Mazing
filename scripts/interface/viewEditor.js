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
        buttonRadiosToBeActive(['mazeTypeBtn', 'createMethodBtn']);
    } else {
        buttonsObj.radio.createMethodBtn[0].checked = true;
        buttonRadiosToBeActive(['mazeTypeBtn'])
    }
}

function updatePointChecksView() {
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
            buttonsToBeActive(['startPointBtn', 'endPointBtn', 'drawWallBtn', 'drawPathBtn', 'applyBtn', 'pathfindingBtn', 'resetGlobalsBtn', 'mazeTypeBtn', 'createMethodBtn']);
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