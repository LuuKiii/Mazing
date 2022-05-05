// CANVAS SETUP
let canvas = document.getElementById("main-window");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

//===== VARIABLES=======
//DOM OBJECTS
//Buttons
let pathfindingBtn = document.getElementById("pathfindingBtn");
let generateBtn = document.getElementById("generateBtn");
let menu = document.getElementById("cogBtn");
//Inputs
let numberOfColumnsInput = document.getElementById("numberOfTiles");
let delayInput = document.getElementById("animationDelay");

// GENERATION
//Inital Values
let cols; //number of columns and rows for grid
let rows;
let grid = []//array that stores all tiles
let tileSide // side of one tile px
let mazeGenerateDelay // maze generation delay

//Deep first search values
let current; // tile currently selected/ used in both generation and pathfinding
let tilesVisited = [];

//A star pathfinding variables

let openSet = [];
let closedSet = [];
let startTileIndex;
let destinationTileIndex;

// INTERFACE
let allowInput = true; //nothing atm
let loading = false; //loading whatever flag
let errorMessages = []; //array of error msgs
let mouseMode;