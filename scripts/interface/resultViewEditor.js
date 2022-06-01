function showResult(){
    document.getElementById("result-time-spent").innerHTML = timeSpent > 0 ? timeSpent : '-';
    document.getElementById("result-iterations").innerHTML = numberOfIterations > 0 ? numberOfIterations : '-';
    document.getElementById("result-path-length").innerHTML = pathLength > 0 ? pathLength : 'Nie znaleziono ścieżki.';

    showResultList();
}

function showResultList() {
    infoContainer.classList.add("shown");
}

function closeResultList() {
    infoContainer.classList.remove("shown");
}

function addErrorMsg(errorMsg) {
    errorMessages.push(errorMsg);
    createTimedError();
}

function createTimedError() {
    closeErrors();

    errorContainer.insertAdjacentHTML('beforeend',`
    <div class='errorMsg'>
    <h2>Błąd</h2>
    <div>
    <a>`  + errorMessages[0] + `</a>
    </div>
    </div>`)
    errorContainer.classList.add("shown")

    clearTimeout(errorTimer);
    errorTimer = setTimeout( function () {
        closeErrors()
    }, 10000)
}

function closeErrors() {
    errors = document.getElementsByClassName('errorMsg')

    Array.prototype.forEach.call(errors, function(error) {
        error.remove();
    })

    errorContainer.classList.remove("shown")
}