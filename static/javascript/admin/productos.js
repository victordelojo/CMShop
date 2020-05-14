addEventListener("load", cargar)
var IdBorrar = ""
var IdEditar = ""
var nombreMod
var descripcionMod
var cantidadMod
var precioMod
var fotoMod
var categoriaMod
var fotoAntiguaMod;

function cargar() {
    $('#idDelModal').modal({backdrop: 'static', keyboard: false})
    nombreMod = document.getElementById("nombreProductoMod")
    descripcionMod = document.getElementById("descipcionProductoMod")
    cantidadMod = document.getElementById("cantProductoMod")
    precioMod = document.getElementById("precioProductoMod")
    fotoMod = document.getElementById("fotoProductoMod")
    categoriaMod = document.getElementById("categoriaProductoMod")
    document.getElementById("guardarProducto").addEventListener("click", guardar);
    var editarBtn = document.getElementsByClassName("editar")
    var borrarBtn = document.getElementsByClassName("borrar")
    document.getElementById("editarProducto").addEventListener("click", editarProducto)
    document.getElementById("borrarProducto").addEventListener("click", borrar)
    for (var i = 0; i < editarBtn.length; i++) {
        borrarBtn[i].addEventListener("click", function(e) {
            IdBorrar = e.target.value;
        })
        editarBtn[i].addEventListener("click", function(e) {
            nombreMod.disabled = true
            descripcionMod.disabled = true
            cantidadMod.disabled = true
            precioMod.disabled = true
            categoriaMod.disabled = true
            IdEditar = e.target.value
            var xhttp1 = new XMLHttpRequest();
            xhttp1.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/productos/obtenerUno", true);
            xhttp1.addEventListener("readystatechange", function() {
                if (this.readyState == 4 && this.status == 200) {
                    nombreMod.disabled = false
                    descripcionMod.disabled = false
                    cantidadMod.disabled = false
                    precioMod.disabled = false
                    categoriaMod.disabled = false
                    $('#editar').modal('show')
                    setTimeout(() => { $('#cargar').modal('hide'); }, 500);

                    e.target.innerHTML = "Editar"
                    datos = JSON.parse(this.responseText);
                    if (datos._id) {
                        nombreMod.value = datos.nombre;
                        descripcionMod.value = datos.descripcion;
                        cantidadMod.value = datos.cantidad;
                        precioMod.value = datos.precio;
                        categoriaMod.value = datos.categoria;
                    }
                } else if (this.readyState == 4) {
                    $('#cargar').modal('hide')
                    $('#editar').modal('hide')
                    document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>No se a podido cargar los datos</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
                }
            })
            xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp1.send("id=" + IdEditar)
        })
    }
    document.getElementById("fotoProducto").addEventListener("change", cambiarNombre);
    document.getElementById("categoria").addEventListener("change",filtro)
}

function filtro(e){
    if(e.target.value==0){
        location.href="./productos";
    }else{
        location.href="./productos?cat="+e.target.value;
    }
}

function cambiarNombre(e) {
    if (document.getElementById("fotoProducto").value == "") {
        document.getElementById("nombreFoto").innerHTML = "Selecciona foto"
    } else {
        document.getElementById("nombreFoto").innerHTML = e.target.value.split("\\")[e.target.value.split("\\").length - 1]
    }
}

function borrar() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/productos/borrar", true);
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload();
            } else {
                $('#borrar').modal('hide')
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
    xhttp.send("id=" + IdBorrar)
}

function editarProducto() {
    $('#cargar').modal('show');
    var seguir = true
    if (nombreMod.value == "") {
        nombreMod.focus()
        nombreMod.classList.add("is-invalid");
        seguir = false;
    } else {
        nombreMod.classList.remove("is-invalid")
    }
    if (descripcionMod.value == "") {
        descripcionMod.focus()
        descripcionMod.classList.add("is-invalid");
        seguir = false;
    } else {
        descripcionMod.classList.remove("is-invalid")
    }
    if (cantidadMod.value == "") {
        cantidadMod.focus()
        cantidadMod.classList.add("is-invalid");
        seguir = false;
    } else {
        cantidadMod.classList.remove("is-invalid")
    }
    if (precioMod.value == "") {
        precioMod.focus()
        precioMod.classList.add("is-invalid");
        seguir = false;
    } else {
        precioMod.classList.remove("is-invalid")
    }
    if (categoriaMod.value == 0) {
        categoriaMod.focus()
        categoriaMod.classList.add("is-invalid");
        seguir = false;
    } else {
        categoriaMod.classList.remove("is-invalid")
    }
    if (seguir) {
        var formulario = document.createElement("form");
        formulario.appendChild(nombreMod.cloneNode(true))
        formulario.appendChild(descripcionMod.cloneNode(true))
        formulario.appendChild(cantidadMod.cloneNode(true))
        formulario.appendChild(precioMod.cloneNode(true))
        var aux1 = categoriaMod.cloneNode(true)
        aux1.value = categoriaMod.value
        formulario.appendChild(aux1)
        var id = document.createElement("input")
        id.value = IdEditar
        id.name = "_id"
        formulario.appendChild(id)
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/productos/actualizar", true);
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    location.reload();
                } else {
                    $('#editar').modal('hide')
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

function guardar() {
    $('#cargar').modal('hide');
    var seguir = true;
    var nombre = document.getElementById("nombreProducto")
    var descripcion = document.getElementById("descipcionProducto")
    var cantidad = document.getElementById("cantProducto")
    var precio = document.getElementById("precioProducto")
    var foto = document.getElementById("fotoProducto")
    var categoria = document.getElementById("categoriaProducto")
    if (nombre.value == "") {
        nombre.focus()
        nombre.classList.add("is-invalid");
        seguir = false;
    } else {
        nombre.classList.remove("is-invalid")
    }
    if (descripcion.value == "") {
        descripcion.focus()
        descripcion.classList.add("is-invalid");
        seguir = false;
    } else {
        descripcion.classList.remove("is-invalid")
    }
    if (cantidad.value == "") {
        cantidad.focus()
        cantidad.classList.add("is-invalid");
        seguir = false;
    } else {
        cantidad.classList.remove("is-invalid")
    }
    if (precio.value == "") {
        precio.focus()
        precio.classList.add("is-invalid");
        seguir = false;
    } else {
        precio.classList.remove("is-invalid")
    }
    if (categoria.value == 0) {
        categoria.focus()
        categoria.classList.add("is-invalid");
        seguir = false;
    } else {
        categoria.classList.remove("is-invalid")
    }
    if (foto.value == "") {
        foto.focus()
        foto.classList.add("is-invalid");
        seguir = false;
    } else {
        foto.classList.remove("is-invalid")
    }
    if (seguir) {
        var formulario = document.createElement("form");
        var aux = categoria.cloneNode(true);
        aux.value = categoria.value;
        formulario.appendChild(nombre.cloneNode(true))
        formulario.appendChild(descripcion.cloneNode(true))
        formulario.appendChild(cantidad.cloneNode(true))
        formulario.appendChild(precio.cloneNode(true))
        formulario.appendChild(aux)
        formulario.appendChild(foto.cloneNode(true))
        formulario.enctype = "multipart/form-data"
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://" + conf.host + ":" + conf.port + "/" + conf.adminD + "/productos/insertar", true);
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                datos = JSON.parse(this.responseText);
                if (datos.estado) {
                    location.reload();
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