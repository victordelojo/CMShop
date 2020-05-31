addEventListener("load", cargar)


function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                document.getElementById("nombreUsu").value = datos.nombre;
                document.getElementById("correoUsu").value = datos.correo;
                document.getElementById("direccionUsu").value = datos.direccion
            } else {
                location.replace("/inicio")
            }
        }
    })
    xhttp.open("POST", "/ajax/usuario", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}