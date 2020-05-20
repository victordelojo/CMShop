addEventListener("load", cargar)
insertar = ""
borrarImg = ""
borrarId = ""

function cargar() {
    $('#idDelModal').modal({ backdrop: 'static', keyboard: false })
    var aux = document.getElementsByClassName("imagenes");
    if (aux.length > 1) {
        for (var i = 0; i < aux.length; i++) {
            aux[i].addEventListener("focus", boton);
            aux[i].addEventListener("focusout", sinBoton);
        }
    }
    var guardar = document.getElementsByClassName("insertar");
    for (var i = 0; i < guardar.length; i++) {
        guardar[i].addEventListener("click", function(e) {
            insertar = e.target.getAttribute("value");
        })
    }
    document.getElementById("fotoProductoNuevo").addEventListener("change", cambiarNombre)
    document.getElementById("guardarFoto").addEventListener("click", guardarfoto);
    document.getElementById("borrarFoto").addEventListener("click", borrarFoto)
    document.getElementById("categoria").addEventListener("change", filtro)
}

function filtro(e) {
    if (e.target.value == 0) {
        location.href = "./fotos";
    } else {
        location.href = "./fotos?cat=" + e.target.value;
    }
}

function cambiarNombre(e) {
    if (document.getElementById("fotoProductoNuevo").value == "") {
        document.getElementById("nombreFoto").innerHTML = "Selecciona foto"
    } else {
        document.getElementById("nombreFoto").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}

function borrarFoto() {
    $('#cargar').modal('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            console.log(datos)
            if (datos.estado) {
                location.href = "./fotos?id=" + borrarId;
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
    };
    xhttp.open("POST", "/" + conf.adminD + "/productos/borrar/foto", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + borrarId + "&foto=" + borrarImg);
}

function guardarfoto() {
    if (document.getElementById("fotoProductoNuevo").value == "") {
        document.getElementById("fotoProductoNuevo").classList.add("is-invalid");
    } else {
        document.getElementById("fotoProductoNuevo").classList.remove("is-invalid");
        $('#cargar').modal('show');
        var formulario = document.createElement("form");
        formulario.appendChild(document.getElementById("fotoProductoNuevo").cloneNode(true))
        var id = document.createElement("input");
        id.value = insertar;
        id.name = "id"
        formulario.appendChild(id)
        formulario.enctype = "multipart/form-data"
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/" + conf.adminD + "/productos/insertar/foto", true);
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    location.href = "./fotos?id=" + insertar;
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

function boton(e) {
    console.log(e.target.parentElement.parentElement.children.length)
    if (e.target.parentElement.parentElement.children.length > 2) {
        var aux = document.createElement("div");
        aux.classList.add("card-img-overlay");
        console.log(e.target)
        borrarId = e.target.getAttribute("value")
        borrarImg = e.target.getAttribute("alt");
        aux.innerHTML = `<button class="btn btn-danger" data-toggle="modal" data-target="#borrar">Borrar</button>`
        e.target.appendChild(aux)
    }

}

function sinBoton(e) {
    if (e.target.parentElement.parentElement.children.length > 2) {
        setTimeout(function() {
            e.target.lastChild.remove();
        }, 100);
    }
}