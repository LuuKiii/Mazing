let isCollapsed = true;

function toggleMenu(){
    isCollapsed = !isCollapsed;
}

menu.addEventListener("click",()=>{
    let content = menu.nextElementSibling;
    toggleMenu();
    if(isCollapsed){
        content.style.visibility = "hidden";
        content.classList.remove('unfolded');
    }else{
        content.style.visibility = "visible"
        content.classList.add('unfolded');
    }
});

function updatePointChecksView(){
    if(!startTileIndex) {
        document.getElementById('startPointCheck').innerHTML = 'Nie wybrano';
    }else{
        document.getElementById('startPointCheck').innerHTML = 'Wybrano';
    }

    if(!destinationTileIndex) {
        document.getElementById('endPointCheck').innerHTML = 'Nie wybrano';
    }else{
        document.getElementById('endPointCheck').innerHTML = 'Wybrano';
    }
}
