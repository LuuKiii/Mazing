function findDifficulty(numberOfTiles, numberOfSearchedTiles, lengthOfPath) {
    if (numberOfTiles < 1) return 'Nie można ustalić';
    if (numberOfSearchedTiles < 1) return 'Nie można ustalić';
    if (isNaN(lengthOfPath) || lengthOfPath < 1) return 'Nie można ustalić';

    let difficulty;



    difficulty = findFillDifficulty(numberOfTiles, numberOfSearchedTiles, lengthOfPath);


    return difficulty;

}

function findStrokeDifficulty(numberOfTiles, numberOfSearchedTiles, lengthOfPath){
    let score = 0//findPathComplexity(lengthOfPath);
    score += findNumberOfForksAlongPath();

    console.log(score)

    if(score < gridCols) return 'Łatwy';
    if(score < gridCols * 2) return 'Średni';
    return 'Trudny';
}

function findFillDifficulty(numberOfTiles, numberOfSearchedTiles, lengthOfPath){
    let searchedPercentage = numberOfSearchedTiles / numberOfTiles * 100;
    let pathPercentage = 100 - (lengthOfPath / numberOfSearchedTiles * 100);

    let score = searchedPercentage + pathPercentage;

    score = lowerForShortPath(score, lengthOfPath, numberOfTiles);

    console.log(searchedPercentage)
    console.log(pathPercentage)
    console.log(score)

    if(score < 120) return 'Łatwy';
    if(score < 160) return 'Średni';
    return 'Trudny';
}

function lowerForShortPath(value, length, searchableTiles){
    if(length < 10) return 0;
    if(length > searchableTiles * 0.9) return 0;
    return value;
}

//Calculates how many more steps need to be made than bare minmum with no obstacles.
function findPathComplexity(pathLength){
    distanceX = Math.abs(grid[startTileIndex].positionX/tileSide - grid[destinationTileIndex].positionX/tileSide) 
    distanceY = Math.abs(grid[startTileIndex].positionY/tileSide - grid[destinationTileIndex].positionY/tileSide) 
    basicPathLength = distanceX + distanceY;

    if(mazeType === 'stroke'){
        
    }

    return pathLength - basicPathLength;
}

//This one is stupid. number of forks is determined by how many neigghbours are not obstacles. 
//But path is also not an obstacle so for path tile 2 numbersOfforks points are deducted.
//For start and End tiles only one point is deducted, since only one tile is a path tile.
function findNumberOfForksAlongPath(){
    let numberOfForks = 0;
    for(const gridEl of grid){
        //TODO: Warning - Giga cursed - checking if object is finalpath by its current color, change ASAP
        if(gridEl.currentBaseColor !== '#c4bc66'){
            if(gridEl.index !== startTileIndex || gridEl.index !== destinationTileIndex){
                continue;
            }
            numberOfForks++;
        }

        numberOfForks = numberOfForks - 2;
        let iteration = -1;
        for(const neighbour of gridEl.neighboursList){
            iteration++;
            if(!neighbour) continue;
            if(isObstacle(neighbour, gridEl.index, iteration)) continue;

            numberOfForks++;
        }
    }

    return numberOfForks;
}
