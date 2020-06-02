addEventListener("load", cargar)

function cargar() {
    document.getElementById("https").addEventListener("change", cambiarHttps);
    document.getElementById("smtp").addEventListener("change", cambiarSmtp);
    document.getElementById("htppsCRT").addEventListener("change", cambiarNombreCrt)
    document.getElementById("htppsKEY").addEventListener("change", cambiarNombreKey)
    document.getElementById("htppsCRT").accept = ".crt"
    document.getElementById("htppsKEY").accept = ".key"
    document.getElementById("guardar").addEventListener("click", guardar)
}

function cambiarNombreCrt(e) {
    if (e.target.value == "") {
        document.getElementById("nombreCRT").innerHTML = "Selecciona archivo " + e.target.accept
    } else {
        document.getElementById("nombreCRT").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}

function cambiarNombreKey(e) {
    if (e.target.value == "") {
        document.getElementById("nombreKEY").innerHTML = "Selecciona archivo " + e.target.accept
    } else {
        document.getElementById("nombreKEY").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}

function guardar() {
    $('#cargar').modal({ backdrop: 'static', keyboard: false })
    var formulario = document.createElement("form")
    formulario.appendChild(document.getElementById("https").cloneNode(true))
    formulario.appendChild(document.getElementById("smtp").cloneNode(true))
    if (document.getElementById("https").checked) {
        var crt = document.getElementById("htppsCRT").cloneNode(true)
        var key = document.getElementById("htppsKEY").cloneNode(true)
        if (crt.value == "") {
            document.getElementById("htppsCRT").classList.add("is-invalid")
            return false
        } else {
            document.getElementById("htppsCRT").classList.remove("is-invalid")
        }
        if (key.value == "") {
            document.getElementById("htppsKEY").classList.add("is-invalid")
            return false
        } else {
            document.getElementById("htppsKEY").classList.remove("is-invalid")
        }
        formulario.appendChild(crt)
        formulario.appendChild(key)

    }
    if (document.getElementById("smtp").checked) {
        var correo = document.getElementById("smtpCorreo").cloneNode(true)
        var contra = document.getElementById("smtpContra").cloneNode(true)
        if (correo.value == "") {
            document.getElementById("smtpCorreo").classList.add("is-invalid")
            return false
        } else {
            document.getElementById("smtpCorreo").classList.remove("is-invalid")
        }
        if (contra.value == "") {
            document.getElementById("smtpContra").classList.add("is-invalid")
            return false
        } else {
            document.getElementById("smtpContra").classList.remove("is-invalid")
        }
        formulario.appendChild(correo)
        formulario.appendChild(contra)
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/" + conf.adminD + "/general/guardar", true);
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            $('#nuevo').modal('hide')

            if (datos.estado) {
                if (document.getElementById("https").checked) {
                    setTimeout(() => { $('#cargar').modal('hide'); }, 500);
                    setTimeout(() => { location.href = "https://" + datos.datos.direccion + "/" + datos.datos.Direccion_Admin }, 1000);

                } else {
                    setTimeout(() => { $('#cargar').modal('hide'); }, 500);
                    setTimeout(() => { location.href = "http://" + datos.datos.direccion + ":" + datos.datos.port + "/" + datos.datos.Direccion_Admin }, 1000);

                }
            } else {
                setTimeout(() => { $('#cargar').modal('hide'); }, 500);
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

function cambiarSmtp() {
    document.getElementById("disabledSMTP").disabled = !document.getElementById("disabledSMTP").disabled
}

function cambiarHttps() {
    document.getElementById("disabled").disabled = !document.getElementById("disabled").disabled
}