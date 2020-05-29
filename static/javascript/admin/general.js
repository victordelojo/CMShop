addEventListener("load", cargar)

function cargar() {
    $('#cargar').modal({ backdrop: 'static', keyboard: false })
    document.getElementById("https").addEventListener("change", cambiarHttps);
    document.getElementById("smtp").addEventListener("change", cambiarSmtp);
    document.getElementById("htppsCRT").accept = ".crt"
    document.getElementById("htppsKEY").accept = ".key"
    document.getElementById("guardar").addEventListener("click", guardar)
}

function guardar() {
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

function cambiarSmtp() {
    document.getElementById("disabledSMTP").disabled = !document.getElementById("disabledSMTP").disabled
}

function cambiarHttps() {
    document.getElementById("disabled").disabled = !document.getElementById("disabled").disabled
}