function numberOfTilesValidator() {
    if (rows > 60) {
        errorMessages.push('Liczba komórek w rzędzie nie może przekroczyć 60');
    }
    else if (rows < 5) {
        errorMessages.push('Liczba komórek w rzędzie nie może być niższa 5');
    }
    if( rows !== Math.round(rows)){
        errorMessages.push('Liczba komórek w rzędzie musi być liczbą całkowitą');
    }
}


function runAllValidators(){
    numberOfTilesValidator();
}