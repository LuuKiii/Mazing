let isCollapsed = true;

function toggleMenu(){
    isCollapsed = !isCollapsed;
}

var menu = document.getElementById("cogBtn");

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
