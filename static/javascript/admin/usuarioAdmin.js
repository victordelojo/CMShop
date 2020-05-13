addEventListener("load", cargar)
var nombre, correo;

function cargar() {
    document.getElementById("btnContra").addEventListener("click", guardarContra)
    document.getElementById("btnCerrar").addEventListener("click", cerrarSesion)
    document.getElementById("btnGuardar").addEventListener("click", guardarDatos)
    nombre = document.getElementById("nombreAdmin").value;
    correo = document.getElementById("correoAdmin").value;
}

function guardarDatos() {
    $('#cargar').modal('show');
    if (nombre != document.getElementById("nombreAdmin").value || correo != document.getElementById("correoAdmin").value) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    $('#contra').modal('hide')
                    setTimeout(() => { $('#cargar').modal('hide'); }, 500);
                    document.getElementById("alerta").innerHTML = "<div class='alert alert-success alert-dismissible fade show' role='alert'>\
                    <strong>Guardado correctamente</strong>\
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                    </button>\
                    </div>"
                    nombre = document.getElementById("nombreAdmin").value;
                    correo = document.getElementById("correoAdmin").value;
                } else {
                    $('#contra').modal('hide')
                    setTimeout(() => { $('#cargar').modal('hide'); }, 500);
                    document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                    <strong>" + datos.error + "</strong>\
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                    </button>\
                    </div>"
                }

            }
        };
        xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/usuarioAdmin/datos", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("nombreAdmin=" + document.getElementById("nombreAdmin").value+"&correoAdmin="+document.getElementById("correoAdmin").value);
    } else {
        $('#contra').modal('hide')
        setTimeout(() => { $('#cargar').modal('hide'); }, 500);
        document.getElementById("alerta").innerHTML = "<div class='alert alert-secondary alert-dismissible fade show' role='alert'>\
                    <strong>Los datos son iguales</strong>\
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                    </button>\
                    </div>"
    }
}

function cerrarSesion() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload();
            } else {
                $('#contra').modal('hide')
                setTimeout(() => { $('#cargar').modal('hide'); }, 500);
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                    <strong>" + datos.error + "</strong>\
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                    </button>\
                    </div>"
            }

        }
    };
    xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/usuarioAdmin/cerrar", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("contra=" + document.getElementById("contraUno").value);
}

function guardarContra() {
    $('#cargar').modal('show');
    if (document.getElementById("contraUno").value == "") {
        document.getElementById("contraUno").classList.add("is-invalid");
        setTimeout(() => { $('#cargar').modal('hide'); }, 500);
        return
    } else {
        document.getElementById("contraUno").classList.remove("is-invalid");
    }
    if (document.getElementById("contraDos").value == "") {
        document.getElementById("contraDos").classList.add("is-invalid");
        document.getElementById("errorContra").innerHTML = "Campo obligatorio"
        setTimeout(() => { $('#cargar').modal('hide'); }, 500);
        return
    } else {
        document.getElementById("contraDos").classList.remove("is-invalid");
    }
    if (document.getElementById("contraDos").value != document.getElementById("contraUno").value) {
        document.getElementById("contraDos").classList.add("is-invalid");
        document.getElementById("errorContra").innerHTML = "Contraseña no coinciden"
        setTimeout(() => { $('#cargar').modal('hide'); }, 500);
        return
    } else {
        document.getElementById("contraDos").classList.remove("is-invalid");
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (!datos.estado) {
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                    <strong>" + datos.error + "</strong>\
                    <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                        <span aria-hidden='true'>&times;</span>\
                    </button>\
                    </div>"
            }
            $('#contra').modal('hide')
            setTimeout(() => { $('#cargar').modal('hide'); }, 500);

        }
    };
    xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/usuarioAdmin/contrasenia", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("contra=" + document.getElementById("contraUno").value);
}