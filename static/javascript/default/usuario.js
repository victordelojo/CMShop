addEventListener("load", cargar)


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
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                document.getElementById("nombreUsu").value = datos.nombre;
                document.getElementById("correoUsu").value = datos.correo;
                document.getElementById("direccionUsu").value = datos.direccion || ""
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