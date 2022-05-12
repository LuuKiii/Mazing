// CANVAS SETUP
let canvas = document.getElementById("main-window");
let ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = 5;

//===== VARIABLES=======
//DOM OBJECTS
//Buttons
let menu = document.getElementById("cogBtn");

let buttonsObj = {
    pathfindingBtn: document.getElementById("pathfindingBtn"),
    generateBtn: document.getElementById("generateBtn"),
    startPointBtn: document.getElementById("startPointBtn"),
    endPointBtn: document.getElementById("endPointBtn"),
    drawWallBtn: document.getElementById("drawWallBtn"),
    drawPathBtn: document.getElementById("drawPathBtn"),
    applyBtn: document.getElementById("applyBtn"),
    resetPathfindingBtn: document.getElementById("resetPathfindingBtn"),
    resetGlobalsBtn: document.getElementById("resetGlobalsBtn"),
    radio: {
        mazeTypeBtn: document.getElementsByName("mazeType"),
        createMethodBtn: document.getElementsByName("createMethod"),
    }
}

let mazeTypeBtn = document.getElementsByName("mazeType");
let createMethodBtn = document.getElementsByName("createMethod");
//Inputs
let numberOfColumnsInput = document.getElementById("numberOfTiles");
let delayInput = document.getElementById("animationDelay");
let tileHoleChanceInput = document.getElementById("tileHoles")

// GENERATION
//Inital Values
let gridCols; //number of columns and rows for grid
let gridRows;
let grid = [];//array that stores all tiles
let tileSide; // side of one tile px
let mazeGenerateDelay; // maze generation delay
let mazeType; // Type of the maze -> tiles with walls[stroke] or block tiles[fill]
let createMethod;

//Deep first search values
let current; // tile currently selected/ used in both generation and pathfinding
let tilesVisited = [];
let tileHoleChance;

//A star pathfinding variables

let openSet = [];
let closedSet = [];
let currentPathHead;

//Both algos variables;
let startTileIndex;
let destinationTileIndex;

// INTERFACE
let allowInput = true; //nothing atm
let loading = false; //loading whatever flag
let errorMessages = []; //array of error msgs
let mouseMode;

// HIGHLIGHTING
let highLightedTileIndex;
let previousHighLightedTileIndex = 0;
let highlightColor;