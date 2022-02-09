// CANVAS SETUP

let canvas = document.getElementById("main-window");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

//===== VARIABLES=======
//DOM OBJECTS
let pathfindingBtn = document.getElementById("pathfindingBtn");
let generateBtn = document.getElementById("generateBtn");
// GENERATION
//Inital Values
let cols, rows; //number of columns and rows for grid
let grid = []; //array that stores all tiles
const tileSide = 80; // side of one tile px
const genDelay = 0; // maze generation delay

//Deep first search values
let current; // tile currently selected/ used in both generation and pathfinding
let tilesVisited = []; 

//A star pathfinding variables
let openSet = [];
let closedSet = [];
let pathingTarget;

// INTERFACE
let allowInput = true; //nothing atm


// INIT

function initGeneration() {
    createGrid();
    randomizeOrigin();
    drawGrid();
    mouseEventHander();
}

function initMazeGenAnimation(){
    eventDisabler();
    // grid[current].currentBaseColor = "#2a3654"
    mazeGenAnimation();
}

function initPathFinding(){
    eventDisabler();  
    openSet.push(0); //pushing just the index of the starting tile. 
    console.log(openSet.length)
    pathingTarget = grid.length - 1; //Destination of pathfinding, for now its just bottom right corner
    pathfindingAnimation();
}

//MAIN

function mazeGenAnimation() {

    if (generatePath()) {
        setTimeout(function () {
            window.requestAnimationFrame(mazeGenAnimation)
        }, genDelay);

    } else {
        window.cancelAnimationFrame(0);
        mouseEventHander();   
        pathfindingBtn.disabled = false;

    }

    grid[current].draw();
}

function pathfindingAnimation(){

    if(!aStar()){
        window.cancelAnimationFrame(0);
        return
    }else{
        setTimeout(function(){
            window.requestAnimationFrame(pathfindingAnimation)
        },0);
    }
    
    console.log("animating");
}

initGeneration();

