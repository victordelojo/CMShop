addEventListener("load", cargar)
var borrar = ""
var editar = ""

function cargar() {
    document.getElementById("guardarCategoria").addEventListener("click", guardarCategoria);
    var borrarBtn = document.getElementsByClassName("borrar")
    for (var i = 0; i < borrarBtn.length; i++) {
        borrarBtn[i].addEventListener("click", function(e) {
            borrar = e.target.value
        })
    }
    var editarBtn = document.getElementsByClassName("editar")
    for (var i = 0; i < editarBtn.length; i++) {
        editarBtn[i].addEventListener("click", function(e) {
            editar = e.target.value
            document.getElementById("editarInputCategoria").value = e.target.value

        })
    }
    document.getElementById("borrarCategoria").addEventListener("click", borrarCategoria)
    document.getElementById("editarCategoria").addEventListener("click", editarCategoria);
}

function editarCategoria() {
    var nuevo = document.getElementById("editarInputCategoria").value;
    if (nuevo != "") {
        if (nuevo == editar) {
            $('#editar').modal('hide')
            document.getElementById("alerta").innerHTML = "<div class='alert alert-warning alert-dismissible fade show' role='alert'>\
                <strong>Nombre de categoría igual</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
        } else {
            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener("readystatechange", function() {
                if (this.readyState == 4 && this.status == 200) {
                    datos = JSON.parse(this.responseText);
                    if (datos.estado) {
                        location.reload();
                    } else {
                        $('#editar').modal('hide')
                        document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
                    }
                }
            })
            xhttp.open("POST", "/" + conf.adminD + "/categorias/editar", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("nombreA=" + editar + "&nombreN=" + nuevo);
        }
    } else {
        $('#editar').modal('hide')
        document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>Campo nombre vacio</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
    }

}

function borrarCategoria() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload();
            } else {
                $('#nuevo').modal('hide')
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
            }
        }
    })
    xhttp.open("POST", "/" + conf.adminD + "/categorias/borrar", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("nombre=" + borrar);
}

function guardarCategoria() {
    var nombre = document.getElementById("nuevaCategoria").value;
    if (nombre != "") {
        var xhttp = new XMLHttpRequest();
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    location.reload();
                } else {
                    $('#nuevo').modal('hide')
                    document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
                }
            }
        })
        xhttp.open("POST", "/" + conf.adminD + "/categorias/insertar", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("nombre=" + nombre);
    } else {
        $('#nuevo').modal('hide')
        document.getElementById("alerta").innerHTML = "<div class='alert alert-warning alert-dismissible fade show' role='alert'>\
                <strong>Campo nombre vacio</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
    }

}