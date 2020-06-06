addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText)
            if (datos.cesta.length != 0) {
                document.getElementById("productos").innerHTML = ""
                for (let i = 0; i < datos.cesta.length; i++) {
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
                    div.innerHTML = "<div class='row'><div class='col-6'><img class='img-fluid' style='max-height:100px' src='../fotos/" + datos.cesta[i].producto.foto[0] + "'></div><div class='col-3'> <h5>Cantidad: " + datos.cesta[i].cantidad + "</h5></div> <div class='col-3'> <h5>Precio: " + datos.cesta[i].producto.precio + "€</h5></div></div>"
                    row.appendChild(div)
                    var btn = document.createElement("button")
                    btn.classList.add("btn")
                    btn.classList.add("btn-outline-danger")
                    var basura = document.createElement("span")
                    basura.classList.add("typcn")
                    basura.classList.add("typcn-trash")
                    btn.value = datos.cesta[i].producto._id
                    basura.value = datos.cesta[i].producto._id
                    btn.addEventListener("click", borrar)
                    btn.appendChild(basura)
                    div2.appendChild(btn)
                    row.appendChild(div2)
                    cardBody.appendChild(row)
                    card.appendChild(cardBody)
                    col.appendChild(card)
                    document.getElementById("productos").appendChild(col)
                }
                var col = document.createElement("div")
                col.classList.add("col-12")
                col.classList.add("text-center")
                col.classList.add("mt-2")
                col.innerHTML = "<h4>Total: " + datos.total + "€</h4>"
                document.getElementById("productos").appendChild(col)
                document.getElementById("productos").appendChild(document.createElement("br"))
                var btn = document.createElement("button")
                btn.addEventListener("click", pagar)
                btn.innerHTML = "Pagar Ya"
                btn.classList.add("btn")
                btn.classList.add("btn-outline-dark")
                btn.classList.add("mt-3")
                btn.classList.add("mb-3")
                var colBtn = document.createElement("div")
                colBtn.classList.add("col-12")
                colBtn.appendChild(btn)
                colBtn.classList.add("text-center")
                var col2 = document.createElement("div")
                col2.classList.add("col-12")
                col2.classList.add("col-sm-6")
                col2.classList.add("mt-3")
                col2.classList.add("mb-3")
                var input = document.createElement("input")
                var text = document.createElement("h5")
                text.innerHTML = "Dirección de envío"
                input.id = "direccion"
                input.classList.add("form-control")
                col2.appendChild(text)
                col2.appendChild(input)
                document.getElementById("productos").appendChild(col2)
                document.getElementById("productos").appendChild(colBtn)
                cargarDireccion()
            }
        }
    })
    xhttp.open("POST", "/ajax/cesta", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function cargarDireccion() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText)
            console.log(datos)
            if (datos.estado) {
                document.getElementById("direccion").value = datos.direccion

            }
        }
    })
    xhttp.open("POST", "/ajax/usuario", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function borrar(e) {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload()
        }
    })
    xhttp.open("POST", "/ajax/cesta/borrar", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + e.target.value);
}

function pagar() {
    if (document.getElementById("direccion").value == "") {
        document.getElementById("direccion").classList.add("is-invalid")
        return false;
    } else {
        document.getElementById("direccion").classList.remove("is-invalid")
        location.replace("/ajax/pagar")
    }

}