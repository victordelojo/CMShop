addEventListener("load", cargar)

function cargar() {
    document.getElementById("guardar").addEventListener("click", guardarDatos)
    document.getElementById("logo").addEventListener("change", cambiarNombreLogo)
    document.getElementById("icono").addEventListener("change", cambiarNombreIco)
    document.getElementById("logo").accept = ".png"
    document.getElementById("icono").accept = ".ico"
}

function cambiarNombreLogo(e) {
    if (e.target.value == "") {
        document.getElementById("nombreLogo").innerHTML = "Selecciona foto"
    } else {
        document.getElementById("nombreLogo").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}

function cambiarNombreIco(e) {
    if (e.target.value == "") {
        document.getElementById("nombreIco").innerHTML = "Selecciona foto"
    } else {
        document.getElementById("nombreIco").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}

function guardarDatos() {
    var nombreEmpresa = document.getElementById("nombreEmpresa")
    var logo = document.getElementById("logo")
    var ico = document.getElementById("icono")
    var loca = document.getElementById("localizacion")
    var email = document.getElementById("email")
    var informa = document.getElementById("informacionEmpresa")

    if (email.value != "" && !(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email.value))) {
        email.classList.add("is-invalid");
    } else {
        email.classList.remove("is-invalid");
        var formulario = document.createElement("form")

        formulario.appendChild(nombreEmpresa.cloneNode(true))
        formulario.appendChild(logo.cloneNode(true))
        formulario.appendChild(ico.cloneNode(true))
        formulario.appendChild(loca.cloneNode(true))
        formulario.appendChild(informa.cloneNode(true))
        formulario.appendChild(email.cloneNode(true))
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/" + conf.adminD + "/informacionEmpresa", true);
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    location.reload()
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


}