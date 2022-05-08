class TileRating {
    constructor(index, pindex, h, g = 1) {
        this.belongsToTileIndex = index;
        this.parentIndex = pindex;
        this.h = h;
        this.g = g;
        this.f = g + h;
    }
}


function findIndexOfHighestf() {
    let highestf = -1;
    let IndexOfHighestf = -1;

    for (i = 0; i < openSet.length; i++) {
        if (highestf < openSet[i].f) {
            highestf = openSet[i].f;
            IndexOfHighestf = i;
        }
    }

    return IndexOfHighestf;
}

function sortOpenSetByfValue() {
    let n = openSet.length;
    let tempObj;
    do {
        for (i = 0; i < n - 1; i++) {
            if (openSet[i].f < openSet[i + 1].f) {
                tempObj = openSet[i + 1];
                openSet[i + 1] = openSet[i];
                openSet[i] = tempObj;
            }
        }
        n--;
    } while (n > 1)
}

function createRatingObject(successor, parentIndex) {
    let g, h;
    g = 1;

    h = (Math.abs(successor.positionX - grid[destinationTileIndex].positionX) +
        Math.abs(successor.positionY - grid[destinationTileIndex].positionY)) / tileSide;


    return new TileRating(successor.index, parentIndex, h, g)
    //console.log(openSet)
}

function isSuccesorChecked(tempSuccessor) {
    //console.log("dlugosc" + closedSet.length)
    for (j = 0; j < closedSet.length; j++) {
        //console.log(closedSet[i].belongsToTileIndex === tempSuccessor.belongsToTileIndex)
        if (closedSet[j].belongsToTileIndex === tempSuccessor.belongsToTileIndex) {

            return true;
        }
        // console.log(closedSet[i] == tempSuccessor)
    }

    for (j = 0; j < openSet.length; j++) {
        //console.log(closedSet[i].belongsToTileIndex === tempSuccessor.belongsToTileIndex)
        if (openSet[j].belongsToTileIndex === tempSuccessor.belongsToTileIndex) {

            return true;
        }
        // console.log(closedSet[i] == tempSuccessor)
    }


    //console.log(tempuccessor)

    //console.log("Nie sa")
    return false;
}

function isNeighbourSeparated(parent, wallNumber) {
    if(parent.walls[wallNumber]){
        return true;
    }

    return false;
}

function aStar() {

    if (openSet.length == 0) return false;

    sortOpenSetByfValue();

    currentPathHead = openSet.pop();

    let tileIndex = currentPathHead.belongsToTileIndex;
    

    grid[tileIndex].currentBaseColor = "#f2ecdc"
    grid[tileIndex].draw();


    for (i = 0; i < grid[tileIndex].neighboursList.length; i++) {
        let successor = grid[tileIndex].neighboursList[i];
        if(successor == null) continue
        

       if (isNeighbourSeparated(grid[tileIndex], i)) {
           continue
       }

        if (successor.index == destinationTileIndex) {
            grid[successor.index].currentBaseColor = "#d16806"
            grid[successor.index].draw();

            
            return false;
        }

        let tempSuccessor = createRatingObject(successor, currentPathHead.belongsToTileIndex);


        if (!isSuccesorChecked(tempSuccessor)) {
            openSet.push(tempSuccessor);
        }

    }

    // grid[currentPathHead.belongsToTileIndex].neighboursList.forEach(successor => {
    //     if (isNeighbourSeparated(grid[tileIndex], successor)) {
    //         return
    //     }

    //     // console.log(successor.index)
    //     if (successor.index == destinationTileIndex) {
    //         //console.log("znaleziono cel");
    //         grid[successor.index].currentBaseColor = "#d16806"
    //         grid[successor.index].draw();

    //         destinationAchivedFlag = true;
    //         return;
    //     }

    //     let tempSuccessor = createRatingObject(successor, currentPathHead.belongsToTileIndex);
    //     //what happens if i reassing this variable to other object? does it fully remove it?

    //     //console.log(tempSuccessor)

    //     if (!isSuccesorChecked(tempSuccessor)) {
    //         openSet.push(tempSuccessor);
    //         //console.log("prawda")
    //     }

    //     //console.log(openSet.length)
    //     //console.log(tempSuccessor)


    // });



    closedSet.push(currentPathHead);


    return true;

}

