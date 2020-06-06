addEventListener("load", cargar)

function cargar() {
    document.getElementById("boton").addEventListener("click", guardar)

}

function guardar() {
    var nombre = document.getElementById("nombre")
    var correo = document.getElementById("correo")
    var contra1 = document.getElementById("pass")
    var contra2 = document.getElementById("pass2")
    if (nombre == "") {
        nombre.classList.add("is-invalid")
        return false
    } else {
        nombre.classList.remove("is-invalid")
    }
    if (correo.value == "") {
        correo.classList.add("is-invalid")
        document.getElementById("errorCorreo").innerHTML = "Campo obligatorio"
        return false
    } else if (!(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(correo.value))) {
        correo.classList.add("is-invalid")
        document.getElementById("errorCorreo").innerHTML = "Correo mal formado"
        return false
    } else {
        correo.classList.remove("is-invalid")
    }
    if (contra1.value == "") {
        contra1.classList.add("is-invalid")
        return false
    } else {
        contra1.classList.remove("is-invalid")
    }
    if (contra2.value == "") {
        contra2.classList.add("is-invalid")
        document.getElementById("errorContra").innerHTML = "Campo obligatorio"
        return false
    } else {
        if (contra2.value != contra2.value) {
            contra2.classList.add("is-invalid")
            document.getElementById("errorContra").innerHTML = "Contraseñas no coinciden"
            return false
        } else {

        }
    }
}