addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText)
            console.log(datos)
            if (datos.estado) {
                for (let i = 0; i < datos.pedidos.length; i++) {
                    if (id == datos.pedidos[i]._id) {
                        seguir(datos.pedidos[i])
                        break;
                    }
                }

            } else {
                history.go(-1)
            }
        }
    })
    xhttp.open("POST", "/ajax/pedidos", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function seguir(datos1) {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText)
            if (datos.estado !== false) {
                var total = 0
                for (let i = 0; i < datos1.contenido.length; i++) {
                    for (let x = 0; x < datos.length; x++) {
                        if (datos1.contenido[i].idProducto == datos[x]._id) {
                            total += datos[x].precio * datos1.contenido[i].cantidad
                            console.log(datos1.contenido[i])
                            var col = document.createElement("div")
                            col.classList.add("col-12")
                            var card = document.createElement("div")
                            card.classList.add("card")
                            var cardBody = document.createElement("div")
                            cardBody.classList.add("card-body")
                            var div = document.createElement("div")
                            var div2 = document.createElement("div")
                            var row = document.createElement("div")
                            row.classList.add("row")
                            row.classList.add("align-items-center")
                            div.classList.add("col-10")
                            div2.classList.add("col-2")
                            div.innerHTML = "<div class='row'><div class='col-6'><img class='img-fluid' style='max-height:100px' src='../fotos/" + datos[x].foto[0] + "'></div><div class='col-3'> <h5>Cantidad: " + datos1.contenido[i].cantidad + "</h5></div> <div class='col-3'> <h5>Precio: " + datos[x].precio + "€</h5></div></div>"
                            row.appendChild(div)

                            row.appendChild(div2)
                            cardBody.appendChild(row)
                            card.appendChild(cardBody)
                            col.appendChild(card)
                            document.getElementById("pedido").appendChild(col)
                        }
                    }

                }
                document.getElementById("pedido").innerHTML += "<div class='col-12 text-center'>Total: " + total + "€</div>"
            }
        }
    })
    xhttp.open("POST", "/ajax/productos", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}