addEventListener("load",cargar)

function cargar(){
    $('#cargar').modal({backdrop: 'static', keyboard: false})
    document.getElementById("https").addEventListener("change",cambiarHttps);
    document.getElementById("smtp").addEventListener("change",cambiarSmtp);
}

function cambiarSmtp(){
    document.getElementById("disabledSMTP").disabled=!document.getElementById("disabledSMTP").disabled
}

function cambiarHttps(){
    document.getElementById("disabled").disabled=!document.getElementById("disabled").disabled
}