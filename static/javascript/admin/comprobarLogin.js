addEventListener("load", cargar);

function cargar() {
    document.getElementById("formulario").addEventListener("submit", nologin);
    document.getElementById("boton").addEventListener("click", comprobar);
    window.onresize = function() {
        if (window.innerWidth < 450) {
            window.innerWidth = 450;
        }
    }
}

function nologin(e) {
    e.preventDefault();
}

function comprobar() {
    var nombre = document.getElementById("nombre").value;
    var pass = document.getElementById("pass").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.replace("/" + conf.adminD);
            } else {
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>Nombre o Contraseña incorectos</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
            }

        }
    };
    xhttp.open("POST", "/" + conf.adminD + "/login/comprobar", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("nombre=" + nombre + "&pass=" + pass);
    //document.getElementById("email").setCustomValidity("I am expecting an e-mail address!");
}