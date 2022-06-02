//Functions shared between multiple algos

function isObstacle(neighbour, currentIndex, wallIndex) {
    switch (mazeType) {
        case 'stroke':
            if (grid[currentIndex].walls[wallIndex] === true) {
                return true;
            }
            return false;
        case 'fill':
            if (neighbour.type === 'wall') {
                return true;
            }
            return false;
    }
}