// CANVAS SETUP

let canvas = document.getElementById("main-window");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

//===== VARIABLES=======

// GENERATION
//Inital Values
let cols, rows; 
let grid = [];
const tileSide = 40; // side of one tile px
const genDelay = 0; // maze generation delay
//Deep first search values
let current; // tile currently selected
let tilesVisited = []; 

// INTERFACE
let allowInput = true; //nothing atm


// INIT

function initGeneration() {
    createGrid();
    randomizeOrigin();
    drawGrid();
}

//MAIN

function mazeGenAnimation() {


    if (generatePath()) {
        setTimeout(function () {
            window.requestAnimationFrame(mazeGenAnimation)
        }, genDelay);

    } else {
        window.cancelAnimationFrame(0);
    }

    drawGrid();
}

initGeneration();
mouseEventHander();


// let start = Date.now();
// let end = Date.now();
// console.log(end - start);