class Tile {
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.walls = [true, true, true, true];
    }

    drawWall(posX, posY, nextPosX, nextPosY) {
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextPosX, nextPosY)
    }

    draw() {
        ctx.beginPath();

        
        if(this.walls[0]){
            this.drawWall(this.positionX, this.positionY, this.positionX + tileSide, this.positionY);
        }
        if(this.walls[1]){
            this.drawWall(this.positionX + tileSide, this.positionY,this.positionX + tileSide, this.positionY + tileSide);
        }
        if(this.walls[2]){
            this.drawWall(this.positionX + tileSide, this.positionY + tileSide, this.positionX, this.positionY + tileSide);
        }
        if(this.walls[3]){
            this.drawWall(this.positionX, this.positionY + tileSide, this.positionX, this.positionY);
        }

        ctx.stroke();
    }
}

// FUNCTIONS

function createGrid() {
    cols = canvas.width / tileSide;
    rows = canvas.height / tileSide;

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let tile = new Tile(i * tileSide, j * tileSide);
            grid.push(tile);
        }
    }
}

function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].draw();
    }
}

