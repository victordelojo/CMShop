addEventListener("load", cargar)

var borrarId = ""

function cargar() {
    $('#idDelModal').modal({backdrop: 'static', keyboard: false})
    document.getElementById("guardarUsu").addEventListener("click", guardarUsu)
    var borr = document.getElementsByClassName("borrar")
    for (var i = 0; i < borr.length; i++) {
        borr[i].addEventListener("click", function (e) {
            borrarId = e.target.value
        })
    }
    document.getElementById("borrarUsu").addEventListener("click", borrarUsu)
    document.getElementById("btnNombre").addEventListener("click", buscarNombre)
    document.getElementById("busquedaNombre").addEventListener("keyup",function(){
        if (event.keyCode === 13) {
            buscarNombre();
        }
    })
    if(document.getElementById("borrarFiltro")){
        document.getElementById("borrarFiltro").addEventListener("click",function(){
            location.href="./usuarios"
        })
    }
}

function buscarNombre() {
    $('#cargar').modal('show');
    if (document.getElementById("busquedaNombre").value == "") {
        document.getElementById("busquedaNombre").classList.add("is-invalid");
        setTimeout(() => { $('#cargar').modal('hide'); }, 500);
    } else {
        location.href="./usuarios?nombre="+document.getElementById("busquedaNombre").value
    }
}

function borrarUsu() {
    $('#cargar').modal('show');
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/usuarios/borrar", true);
    xhttp.addEventListener("readystatechange", function () {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload();
            } else {
                $('#borrar').modal('hide')
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
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + borrarId)
}

function guardarUsu() {
    var guardar = true
    if (document.getElementById("nombreUsuNuevo").value == "") {
        document.getElementById("nombreUsuNuevo").classList.add("is-invalid");
        guardar = false
    } else {
        document.getElementById("nombreUsuNuevo").classList.remove("is-invalid");
    }


    if (document.getElementById("correoUsuNuevo").value == "") {
        console.log("entra")
        document.getElementById("correoUsuNuevo").classList.add("is-invalid");
        document.getElementById("errorCorreoNuevo").innerHTML = "Campo obligatorio"
        guardar = false
    } else {
        if (!(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(document.getElementById("correoUsuNuevo").value))) {
            document.getElementById("correoUsuNuevo").classList.add("is-invalid");
            document.getElementById("errorCorreoNuevo").innerHTML = "Correo mal escrito"
            guardar = false
        } else {
            document.getElementById("correoUsuNuevo").classList.remove("is-invalid");
        }
    }


    if (document.getElementById("contraUnoNuevo").value == "") {
        document.getElementById("contraUnoNuevo").classList.add("is-invalid");
        guardar = false
    } else {
        document.getElementById("contraUnoNuevo").classList.remove("is-invalid");

    }


    if (document.getElementById("contraDosNuevo").value == "") {
        document.getElementById("errorContraNuevo").innerHTML = "Campo obligatorio"
        document.getElementById("contraDosNuevo").classList.add("is-invalid");
        guardar = false
    } else {
        if (document.getElementById("contraUnoNuevo").value != document.getElementById("contraDosNuevo").value && document.getElementById("contraUnoNuevo").value != "" && document.getElementById("contraDosNuevo").value != "") {
            document.getElementById("errorContraNuevo").innerHTML = "Contraseñas no coinciden"
            document.getElementById("contraDosNuevo").classList.add("is-invalid");
            guardar = false
        } else {
            document.getElementById("contraDosNuevo").classList.remove("is-invalid");

        }

    }

    if (guardar) {
        $('#cargar').modal('show');
        var formulario = document.createElement("form")
        formulario.appendChild(document.getElementById("nombreUsuNuevo").cloneNode(true));
        formulario.appendChild(document.getElementById("correoUsuNuevo").cloneNode(true));
        formulario.appendChild(document.getElementById("contraUnoNuevo").cloneNode(true));
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/usuarios/insertar", true);
        xhttp.addEventListener("readystatechange", function () {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    location.href = "./usuarios";
                } else {
                    $('#nuevo').modal('hide')
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
}