let isCollapsed = true;

function toggleMenu(){
    isCollapsed = !isCollapsed;
}

function switchToStartPoint(){
    mouseMode = 'startPoint';
}

function switchToEndPoint(){
    mouseMode = 'endPoint';
}

function switchToDrawWall(){
    mouseMode = 'drawWall';
}

function switchToDrawPath(){
    mouseMode = 'drawPath';
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
