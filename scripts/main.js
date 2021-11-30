// CANVAS SETUP

let canvas = document.getElementById("main-window");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

//===== VARIABLES=======

// GENERATION
let cols, rows;
let grid = [];
const tileSide = 40;
const genDelay = 0;

let current;
let tilesVisited = [];


// INIT

function initGeneration() {
    createGrid();
    randomizeOrigin();
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

mazeGenAnimation();


// let start = Date.now();
// let end = Date.now();
// console.log(end - start);