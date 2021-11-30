// CANVAS SETUP

let canvas = document.getElementById("main-window");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

// VARIABLES

let cols, rows;
let grid = [];
const tileSide = 20;

let current;
let tilesVisited = [];

//MAIN




createGrid();

randomizeOrigin();

generatePath();

drawGrid();


function animate(){

}


// let start = Date.now();
// let end = Date.now();
// console.log(end - start);