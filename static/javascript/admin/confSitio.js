addEventListener("load", cargar)

function cargar() {
    document.getElementById("guardar").addEventListener("click", guardarDatos);
    document.getElementById("btnZip").addEventListener("click", guardarZip)
    document.getElementById("temaZip").addEventListener("change", cambiarNombre)
    document.getElementById("temaZip").accept = ".zip"

    var btnBorrarTema = document.getElementsByClassName("borrarTema")
    for (let i = 0; i < btnBorrarTema.length; i++) {
        btnBorrarTema[i].addEventListener("click", function(e) {
            $('#cargar').modal({ backdrop: 'static', keyboard: false })
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "/" + conf.adminD + "/confSitio/borrarTema", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.addEventListener("readystatechange", function() {
                if (this.readyState == 4 && this.status == 200) {
                    datos = JSON.parse(this.responseText);
                    $('#nuevo').modal('hide')
                    setTimeout(() => { $('#cargar').modal('hide'); }, 500);
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
            xhttp.send("tema=" + e.target.value)
        })

    }
}

function guardarZip() {
    if (document.getElementById("temaZip").value == "") {
        document.getElementById("temaZip").classList.add("is-invalid")
        return ""
    } else {
        document.getElementById("temaZip").classList.remove("is-invalid")
    }
    var formulario = document.createElement("form")
    formulario.appendChild(document.getElementById("temaZip").cloneNode(true))
    $('#cargar').modal({ backdrop: 'static', keyboard: false })
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/" + conf.adminD + "/confSitio/descomprimir", true);
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            $('#nuevo').modal('hide')
            setTimeout(() => { $('#cargar').modal('hide'); }, 500);
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

function guardarDatos() {
    var nombre = document.getElementById("nombreSitio").cloneNode(true)
    var port = document.getElementById("portSitio").cloneNode(true)
    var admin = document.getElementById("nombreAdmin").cloneNode(true)
    var temas = document.getElementsByClassName("radio")
    var tema;
    for (let i = 0; i < temas.length; i++) {
        if (temas[i].checked) {
            tema = temas[i].cloneNode(true)
        }
    }
    if (nombre.value == "") {
        document.getElementById("nombreSitio").classList.add("is-invalid")
        return false
    } else {
        document.getElementById("nombreSitio").classList.remove("is-invalid")
    }
    if (document.getElementById("portSitio").value == "") {
        document.getElementById("portSitio").classList.add("is-invalid")
        return false
    } else {
        document.getElementById("portSitio").classList.remove("is-invalid")
    }
    if (document.getElementById("nombreAdmin").value == "") {
        document.getElementById("nombreAdmin").classList.add("is-invalid")
        return false
    } else {
        document.getElementById("nombreAdmin").classList.remove("is-invalid")
    }
    $('#cargar').modal({ backdrop: 'static', keyboard: false })
    var formulario = document.createElement("form")
    formulario.appendChild(nombre)
    formulario.appendChild(port)
    formulario.appendChild(admin)
    formulario.appendChild(tema)
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/" + conf.adminD + "/confSitio/guardar", true);
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            $('#nuevo').modal('hide')
            setTimeout(() => { $('#cargar').modal('hide'); }, 500);
            if (datos.estado) {
                if (port.value == 443) {
                    setInterval(function() { location.href = "https://" + nombre.value + "/" + admin.value }, 500)
                } else {
                    setInterval(function() { location.href = "http://" + nombre.value + ":" + port.value + "/" + admin.value }, 500)
                }
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

function cambiarNombre(e) {
    if (document.getElementById("temaZip").value == "") {
        document.getElementById("nombreZip").innerHTML = "Selecciona Zip"
    } else {
        document.getElementById("nombreZip").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}