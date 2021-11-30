class Tile {
    constructor(positionX, positionY, index) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.index = index;
        this.walls = [true, true, true, true];
        this.neighbours = [];
        this.visited = false;
    }

    edgeCheck(NeighbourIndex, sides) {

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

    neighbour() {

        this.neighbours = [];

        let topNeighbour = grid[this.edgeCheck(this.index - cols, 0)];
        let rightNeighbour = grid[this.edgeCheck(this.index + 1, 1)];
        let bottomNeighbour = grid[this.edgeCheck(this.index + cols, 0)];
        let leftNeighbour = grid[this.edgeCheck(this.index - 1, 2)];

        if (topNeighbour && !topNeighbour.visited) {
            this.neighbours.push(topNeighbour);
        }

        if (rightNeighbour && !rightNeighbour.visited) {
            this.neighbours.push(rightNeighbour);
        }

        if (bottomNeighbour && !bottomNeighbour.visited) {
            this.neighbours.push(bottomNeighbour);
        }

        if (leftNeighbour && !leftNeighbour.visited) {
            this.neighbours.push(leftNeighbour);
        }


    }



    drawWall(posX, posY, nextPosX, nextPosY) {
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextPosX, nextPosY);
    }

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


        // if (this.visited === true) {
        //     ctx.fillStyle = "#cff2ff";
        //     ctx.fillRect(this.positionX, this.positionY, tileSide, tileSide)
        // }

        if (this.index === current){
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(this.positionX, this.positionY, tileSide, tileSide)
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
            let tile = new Tile(i * tileSide, j * tileSide, grid.length);
            grid.push(tile);
        }
    }
}

function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].draw();

        // ctx.fillStyle = "#000000";
        // ctx.fillText(grid[i].index, grid[i].positionX, grid[i].positionY + tileSide);
    }
}

