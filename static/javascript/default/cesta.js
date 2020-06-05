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
                    div.innerHTML = "<div class='row'><div class='col-6'><img class='img-fluid' style='max-height:100px' src='../fotos/" + datos.cesta[i].producto.foto[0] + "'></div><div class='col-3'> <h5>Cantidad: " + datos.cesta[i].cantidad + "</h5></div> <div class='col-3'> <h5>Precio: "+datos.cesta[i].producto.precio+"€</h5></div></div>"
                    row.appendChild(div)
                    var btn = document.createElement("button")
                    btn.classList.add("btn")
                    btn.classList.add("btn-outline-danger")
                    var basura = document.createElement("span")
                    basura.classList.add("typcn")
                    basura.classList.add("typcn-trash")
                    btn.value=datos.cesta[i].producto._id
                    basura.value=datos.cesta[i].producto._id
                    btn.addEventListener("click",borrar)
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
                document.getElementById("productos").appendChild(btn)
            }
        }
    })
    xhttp.open("POST", "/ajax/cesta", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function borrar(e){
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            location.reload()
        }
    })
    xhttp.open("POST", "/ajax/cesta/borrar", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id="+e.target.value);
}

function pagar() {
    location.replace("/ajax/pagar")
}