addEventListener("load", cargar)

function cargar() {
    window.onresize = function() {
        if (window.innerWidth < 450) {
            window.innerWidth = 450;
        }
    }
    document.getElementById("formulario").addEventListener("submit", nologin);
    document.getElementById("boton").addEventListener("click", comprobar);
}

function nologin(e) {
    e.preventDefault();
}

function comprobar() {
    var formulario = document.createElement("form")
    formulario.appendChild(document.getElementById("correo").cloneNode(true))
    formulario.appendChild(document.getElementById("pass").cloneNode(true))
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/ajax/usuario/inicio", true);
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.replace("/usuario")
            } else {
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
            }
        }
    })
    xhttp.send(new FormData(formulario))
}