class Tile {
    constructor(positionX, positionY, index) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.index = index;
        this.walls = [true, true, true, true];
  
        this.neighboursList = [];
        this.unvisitedNeighbours = [];
        this.visited = false;

        this.currentBaseColor = "#cff2ff";
    }




    drawWall(posX, posY, nextPosX, nextPosY) {
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextPosX, nextPosY);
    }
// sets color background. separated for hovering over tiles.
    drawBackgroundColor(){
        ctx.fillRect(this.positionX, this.positionY, tileSide, tileSide);
    }



    //ddraws walls that havent been ereased and paints tiles background
    draw() {
        ctx.beginPath();

        if (this.walls[0]) {
            this.drawWall(this.positionX, this.positionY, this.positionX + tileSide, this.positionY);
        }
        if (this.walls[1]) {
            this.drawWall(this.positionX + tileSide, this.positionY, this.positionX + tileSide, this.positionY + tileSide);
        }
        if (this.walls[2]) {
            this.drawWall(this.positionX + tileSide, this.positionY + tileSide, this.positionX, this.positionY + tileSide);
        }
        if (this.walls[3]) {
            this.drawWall(this.positionX, this.positionY + tileSide, this.positionX, this.positionY);
        }


        ctx.fillStyle = this.currentBaseColor;
        this.drawBackgroundColor();

        
        ctx.fillStyle = "#000000";
        ctx.fillText(this.index, this.positionX, this.positionY + tileSide);


        ctx.stroke();
    }
}
//Tile Class Methods
Tile.prototype.createNeighbourList = function(){
    let potentialNeighbours = [];
    potentialNeighbours.push(grid[this.edgeCheck(this.index - cols, 0)]);
    potentialNeighbours.push(grid[this.edgeCheck(this.index + 1, 1)]);
    potentialNeighbours.push(grid[this.edgeCheck(this.index + cols, 0)]);
    potentialNeighbours.push(grid[this.edgeCheck(this.index - 1, 2)]);

    //after establishing all potentail neighbours, function checks if a neighbour is out of bounds, and if
    //it is the case, this neighbours is saved as undefined. Undefined is recognized as a false statement, 
    //therefor to the neighbours list are added tiles that are defined
    // potentialNeighbours.forEach((potentialNeighbour) =>{
    //     if(potentialNeighbour){
    //         this.neighboursList.push(potentialNeighbour);       
    //     }
        
    // })

    for(i = 0; i < potentialNeighbours.length; i++){
        if(potentialNeighbours[i] == undefined){
            this.neighboursList.push(null); 
        }else{
            this.neighboursList.push(potentialNeighbours[i]);    
        }
        
    }

    console.log(this.neighboursList.length)
}

// Function required for maze generation. Checks if depth first search algorithim already visited given tile
Tile.prototype.createUnvisitedNeighbourList = function(){
    this.unvisitedNeighbours  = [];

    this.neighboursList.forEach((neighbour) =>{
        if(neighbour == undefined) return
        if(neighbour.visited == false){
            this.unvisitedNeighbours.push(neighbour);
        }
    })

}

//Function checking if a tile is out of bounds
Tile.prototype.edgeCheck = function(NeighbourIndex, sides){

        if (NeighbourIndex < 0 || NeighbourIndex >= grid.length) {
            return -1;
        }

        let NeighbourX = grid[NeighbourIndex].positionX / tileSide;

        if (NeighbourX % rows === 0 && sides === 1) {
            return -1;
        }

        if ((NeighbourX + 1) % rows === 0 && sides === 2) {
            return -1;
        }

        return NeighbourIndex;   
}

// FUNCTIONS

function createGrid() {
    cols = Math.floor(canvas.width / tileSide);
    rows = Math.floor(canvas.height / tileSide);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let tile = new Tile(i * tileSide, j * tileSide, grid.length);
            grid.push(tile);
        }
    }
    
}

function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].draw();
        grid[i].createNeighbourList();

        //  ctx.fillStyle = "#000000";
        //  ctx.fillText(grid[i].index, grid[i].positionX, grid[i].positionY + tileSide);
    }
}

//Selecting tile functions

//needs to have a value since its being compared to at the beggining
let tempX, tempY, highLightedTile, previouslyHighLighted = 0;

function tileHoveredOver() {
    
    try{
        tempX = Math.floor(getMousePos(event).x/tileSide);
        tempY = Math.floor(getMousePos(event).y/tileSide);

        highLightedTile = (tempX) + (tempY)*rows;

        if(highLightedTile != previouslyHighLighted){
            //restore basic color of the tile
            grid[previouslyHighLighted].draw(); 
            previouslyHighLighted = highLightedTile; 
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            grid[highLightedTile].drawBackgroundColor();
        }
        
    }catch(error){
        //reset the coords when outofbounds to 0
        tempX = 0;
        tempY = 0;
        previouslyHighLighted = 0;
    }

}

let previouslySelected = -1;

function tileClicked() {

    if(previouslySelected > -1){
        grid[previouslySelected].currentBaseColor = "#cff2ff";
        grid[previouslySelected].draw();
    }
    

    previouslySelected = highLightedTile;
    grid[highLightedTile].currentBaseColor = 'rgba(255, 0, 0, 0.75)';
    current = highLightedTile;
}