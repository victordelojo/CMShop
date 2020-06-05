addEventListener("load", cargar)

var estaDireccion;

function cargar() {
    document.getElementById("cerrar").addEventListener("click", function() {
        var xhttp = new XMLHttpRequest();
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                location.reload()
            }
        })
        xhttp.open("POST", "/ajax/cerrarSesion", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
    })

    document.getElementById("guardar").addEventListener("click",guardar);
    document.getElementById("guardarContra").addEventListener("click",guardarContra)
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                document.getElementById("nombreUsu").value = datos.nombre;
                document.getElementById("correoUsu").value = datos.correo;
                document.getElementById("direccionUsu").value = datos.direccion || ""
                estaDireccion=document.getElementById("direccionUsu").value=="" ? false:true
            } else {
                location.replace("/inicio")
            }
        }
    })
    xhttp.open("POST", "/ajax/usuario", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
    var xhttp1 = new XMLHttpRequest();
    xhttp1.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                for (let i = 0; i < datos.pedidos.length; i++) {
                    var row = document.createElement("div")
                    row.classList.add("row")
                    var col = document.createElement("div")
                    col.classList.add("col-12")
                    var card = document.createElement("div")
                    card.classList.add("card")
                    var cardBody = document.createElement("div")
                    cardBody.classList.add("card-body")
                    cardBody.innerHTML = "Nº pedido: " + datos.pedidos[i]._id + "<br>Estado:" + datos.pedidos[i].estado;
                    var aux = 0;
                    console.log(datos.pedidos[i])
                    for (let x = 0; x < datos.pedidos[i].contenido.length; x++) {
                        aux += datos.pedidos[i].contenido[x].precio * datos.pedidos[i].contenido[x].cantidad
                    }
                    console.log(datos)
                    cardBody.innerHTML += "<br><b>Total: " + aux + "</b>";
                    card.appendChild(cardBody)
                    col.appendChild(card)
                    row.appendChild(col)
                    document.getElementById("pedidos").appendChild(row)
                }
            } else {
                location.replace("/inicio")
            }
        }
    })
    xhttp1.open("POST", "/ajax/pedidos", true);
    xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp1.send();
}

function guardarContra(){
    var contra1=document.getElementById("contraUno")
    var contra2=document.getElementById("contraDos")
    if(contra1.value==""){
        contra1.classList.add("is-invalid")
        return false
    }else{
        contra1.classList.remove("is-invalid")
    }
    if(contra2.value==""){
        contra2.classList.add("is-invalid")
        document.getElementById("errorContra").innerHTML="Campo obligatorio"
        return false
    }else if(contra2.value!=contra1.value){
        contra2.classList.add("is-invalid")
        document.getElementById("errorContra").innerHTML="Contraseñas distintas"
        return false
    }
    var formulario = document.createElement("form")
    formulario.appendChild(contra1.cloneNode(true))
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                $('#cambiar').modal('hide')
            } else {
                console.log(datos)
            }
        }
    })
    xhttp.open("POST", "/ajax/usuario/actualizar/datos", true);
    xhttp.send(new FormData(formulario));
    console.log(formulario)
}

function guardar(){
    var nombre=document.getElementById("nombreUsu")
    var correo=document.getElementById("correoUsu")
    var direccion=document.getElementById("direccionUsu")
    if(estaDireccion){
        if(document.getElementById("direccionUsu").value==""){
            document.getElementById("direccionUsu").classList.add("is-invalid")
            return false
        }else{
            document.getElementById("direccionUsu").classList.remove("is-invalid")
            var direccion = document.getElementById("direccionUsu")
        }
    }
    if(nombre.value==""){
        nombre.classList.add("is-invalid")
        return false
    }else{
        nombre.classList.remove("is-invalid")
    }
    if(correo.value=="" && !(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(correo.value))){
        correo.classList.add("is-invalid")
        return false
    }else{
        correo.classList.remove("is-invalid")
    }
    var formulario = document.createElement("form")
    formulario.appendChild(nombre.cloneNode(true))
    formulario.appendChild(correo.cloneNode(true))
    formulario.appendChild(direccion.cloneNode(true))
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                console.log(datos)
            } else {
                console.log(datos)
            }
        }
    })
    xhttp.open("POST", "/ajax/usuario/actualizar/datos", true);
    xhttp.send(new FormData(formulario));
    console.log(formulario)
}