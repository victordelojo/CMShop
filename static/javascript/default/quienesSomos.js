addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            document.getElementById("nombreEmpresa").innerHTML = datos.nombreEmpresa;
            document.getElementById("mapa").innerHTML = datos.localizacionEmpresa;
            document.getElementById("informacionEmpresa").innerHTML = datos.informacionEmpresa;
            document.getElementById("emailContacto").innerHTML += datos.emailContacto;
        }
    })
    xhttp.open("POST", "/ajax/informacionEmpresa", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}