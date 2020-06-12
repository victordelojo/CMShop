addEventListener("load", cargar)
var hrf = ["?", "?", "?"]

idAnular = ""
idPasar = ""

function cargar() {
    if (document.getElementById("borrarFiltro")) {
        document.getElementById("borrarFiltro").addEventListener("click", function() {
            location.href = "./pedidos"
        })
    }
    var aux = document.getElementsByClassName("anular");
    for (let i = 0; i < aux.length; i++) {
        aux[i].addEventListener("click", function(e) {
            idAnular = e.target.value
        })
    }
    var aux = document.getElementsByClassName("pasar");
    for (let i = 0; i < aux.length; i++) {
        aux[i].addEventListener("click", function(e) {
            idPasar = e.target.value
        })
    }
    document.getElementById("estado").addEventListener("change", function(e) {
        location.href = "./pedidos?estado=" + e.target.value
    })
    document.getElementById("anularPedido").addEventListener("click", anular)
    document.getElementById("pasarPedido").addEventListener("click", pasar)
}

function pasar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload()
            } else {
                $('#anular').modal('hide')
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
            }
        }
    })
    xhttp.open("POST", "/" + conf.adminD + "/pedidos/pasarEstado", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + idPasar);
}

function anular() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload()
            } else {
                $('#anular').modal('hide')
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
            }
        }
    })
    xhttp.open("POST", "/" + conf.adminD + "/pedidos/anular", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + idAnular);
}