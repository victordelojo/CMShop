addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText)
            console.log(datos)
            if (datos.estado) {
                document.getElementById("salida").value += "?id=" + datos.id
                document.getElementById("realizarPago").submit();
            } else {
                alert("No se ha podido realizar el pedido")
                history.go(-1)
            }
        }
    })
    xhttp.open("POST", "/ajax/comprar", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}