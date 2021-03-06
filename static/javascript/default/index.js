addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado == false) {
                document.getElementById("productos").innerHTML = "No hay productos"
            } else {
                for (let i = 0; i < 9 && i < datos.length; i++) {
                    var a = document.createElement("div");
                    a.classList.add("col-12")
                    a.classList.add("col-sm-6")
                    a.classList.add("col-lg-4")
                    a.classList.add("mb-5")
                    var b = document.createElement("div");
                    b.classList.add("card");
                    var c = document.createElement("div")
                    c.classList.add("card-body")
                    var nombre = document.createElement("h5")
                    nombre.innerHTML = datos[i].nombre
                    c.appendChild(nombre)
                    var img = document.createElement("img")
                    img.src = "../fotos/" + datos[i].foto[0]
                    img.classList.add("img-fluid")
                    img.classList.add("w-75")
                    img.style.maxHeight = "300px"
                    var a2 = document.createElement("a")
                    a2.href = "/producto?id=" + datos[i]._id
                    a2.appendChild(img)
                    var d = document.createElement("div")
                    d.classList.add("row")
                    d.classList.add("mt-3")
                    var e = document.createElement("div")
                    e.classList.add("col-6")
                    var f = document.createElement("button")
                    f.innerHTML = "VER"
                    f.value = datos[i]._id
                    f.classList.add("btn")
                    f.classList.add("btn-outline-dark")
                    f.addEventListener("click", function(e) {
                        location.replace("/producto?id=" + e.target.value)
                    })
                    var g = e.cloneNode(true)
                    g.classList.add("align-self-center")
                    var h = document.createElement("h6")
                    h.innerHTML = datos[i].precio + " €"
                    e.appendChild(f)
                    g.appendChild(h)
                    d.appendChild(e)
                    d.appendChild(g)
                    c.appendChild(a2)
                    c.appendChild(d)
                    b.appendChild(c)
                    a.appendChild(b)
                    document.getElementById("productos").appendChild(a)
                }
            }
        }
    })
    xhttp.open("POST", "/ajax/productos", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}