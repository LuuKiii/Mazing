function numberOfTilesValidator() {
    if (gridRows > 60) {
        addErrorMsg('Liczba komórek w rzędzie nie może przekroczyć 60')
    }
    else if (gridRows < 5) {
        addErrorMsg('Liczba komórek w rzędzie nie może być niższa 5')
    }
    if( gridRows !== Math.round(gridRows)){
        addErrorMsg('Liczba komórek w rzędzie musi być liczbą całkowitą')
    }
}

function adjustLineWidth() {
    ctx.lineWidth = 5;
    if(gridRows > 30){
        ctx.lineWidth = 3;
    }
    else if(gridRows > 50){
        ctx.lineWidth = 1;
    }
}
 

function runAllValidators(){
    numberOfTilesValidator();
    adjustLineWidth();
}