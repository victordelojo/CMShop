addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                document.getElementById("nombre").value = datos.nombre;
                document.getElementById("correo").value = datos.correo;
            }
        }
    })
    xhttp.open("POST", "/ajax/usuario", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();

    document.getElementById("boton").addEventListener("click", enviar)
}

function enviar() {
    var nombre = document.getElementById("nombre").cloneNode(true)
    var correo = document.getElementById("correo").cloneNode(true)
    var asunto = document.getElementById("asunto").cloneNode(true)
    var pregunta = document.getElementById("pregunta").cloneNode(true)

    if (nombre.value == "") {
        document.getElementById("nombre").classList.add("is-invalid")
    } else if (correo.value == "") {
        document.getElementById("nombre").classList.remove("is-invalid")
        document.getElementById("correo").classList.add("is-invalid")
    } else if (!(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(correo.value))) {
        document.getElementById("nombre").classList.remove("is-invalid")
        document.getElementById("correo").classList.add("is-invalid")
        document.getElementById("errorEmail").innerHTML = "Correo mal escrito"
    } else if (asunto.value == "") {
        document.getElementById("errorEmail").innerHTML = "Todos los apartados tiene que estar rellenos"
        document.getElementById("nombre").classList.remove("is-invalid")
        document.getElementById("correo").classList.remove("is-invalid")
        document.getElementById("asunto").classList.add("is-invalid")
    } else if (pregunta.value == "") {
        document.getElementById("nombre").classList.remove("is-invalid")
        document.getElementById("correo").classList.remove("is-invalid")
        document.getElementById("asunto").classList.remove("is-invalid")
        document.getElementById("pregunta").classList.add("is-invalid")
        document.getElementById("errorPregunta").innerHTML = "Todos los apartados tiene que estar rellenos"
    } else {
        if (pregunta.value.length > 450) {
            document.getElementById("nombre").classList.remove("is-invalid")
            document.getElementById("correo").classList.remove("is-invalid")
            document.getElementById("asunto").classList.remove("is-invalid")
            document.getElementById("pregunta").classList.add("is-invalid")
            document.getElementById("errorPregunta").innerHTML = "Como maximo 450 letras"
        } else {
            document.getElementById("nombre").classList.remove("is-invalid")
            document.getElementById("correo").classList.remove("is-invalid")
            document.getElementById("asunto").classList.remove("is-invalid")
            document.getElementById("pregunta").classList.remove("is-invalid")
            var formulario = document.createElement("form");
            formulario.appendChild(nombre)
            formulario.appendChild(correo)
            formulario.appendChild(asunto)
            formulario.appendChild(pregunta)
            var xhttp1 = new XMLHttpRequest();
            xhttp1.addEventListener("readystatechange", function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText)
                    var datos = JSON.parse(this.responseText);
                    if (datos.estado) {
                        alert("Su pregunta a sido enviado correctamente")
                        document.getElementById("asunto").value = ""
                        document.getElementById("pregunta").value = ""
                    }
                }
            })
            xhttp1.open("POST", "/correo/ayuda", true);
            xhttp1.send(new FormData(formulario));
        }

    }
}