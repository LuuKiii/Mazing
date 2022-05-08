function numberOfTilesValidator() {
    if (gridRows > 60) {
        errorMessages.push('Liczba komórek w rzędzie nie może przekroczyć 60');
    }
    else if (gridRows < 5) {
        errorMessages.push('Liczba komórek w rzędzie nie może być niższa 5');
    }
    if( gridRows !== Math.round(gridRows)){
        errorMessages.push('Liczba komórek w rzędzie musi być liczbą całkowitą');
    }
}
 

function runAllValidators(){
    numberOfTilesValidator();
}