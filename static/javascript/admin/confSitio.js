addEventListener("load",cargar)

function cargar(){
    $('#idDelModal').modal({backdrop: 'static', keyboard: false})
    document.getElementById("https").addEventListener("change",cambiarHttps);
}

function cambiarHttps(){
    document.getElementById("disabled").disabled=!document.getElementById("disabled").disabled
}