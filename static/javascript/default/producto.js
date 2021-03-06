addEventListener("load", cargar)

function cargar() {
    document.getElementById("añadir").addEventListener("click", cesta)
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            var cat = ""
            var idRe = ""
            datos.forEach((element, key) => {
                if (element._id == id) {
                    document.getElementById("nombre").innerHTML = element.nombre
                    document.getElementById("descripcion").innerHTML = element.descripcion
                    document.getElementById("precio").innerHTML = element.precio + "€"
                    document.getElementById("stock").innerHTML += element.cantidad
                    document.getElementById("imagen").src = "../fotos/" + element.foto[0]
                    for (let i = 0; i < element.foto.length; i++) {
                        console.log(element.foto[i])
                        var div = document.createElement("div");
                        div.classList.add("col-3")
                        div.classList.add("p-0")
                        div.classList.add("m-2")
                        var img = document.createElement("img")
                        img.classList.add("img-fluid")
                        img.src = "../fotos/" + element.foto[i]
                        div.appendChild(img)
                        div.addEventListener("click", cambiarFoto);
                        document.getElementById("imagenes").appendChild(div)
                    }
                    cat = element.categoria;
                    idRe = element._id
                }
            });
            var x = 0
            for (let i = 0; i < datos.length && x < 3; i++) {
                if (cat == datos[i].categoria && datos[i]._id != idRe) {
                    x++;
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
                    c.appendChild(img)
                    c.appendChild(d)
                    b.appendChild(c)
                    a.appendChild(b)
                    document.getElementById("relacionados").appendChild(a)
                }
            }
        }
    })
    xhttp.open("POST", "/ajax/productos", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();

}

function cesta() {
    if (document.getElementById("cantidad").value > 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && this.status == 200) {
                if (JSON.parse(this.responseText).estado) {
                    location.reload()
                } else {
                    alert(JSON.parse(this.responseText).error)
                }
            }
        })
        xhttp.open("POST", "/ajax/cesta/agregar", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id=" + id + "&cantidad=" + document.getElementById("cantidad").value);
    }
}

function cambiarFoto(e) {
    document.getElementById("imagen").src = e.target.src
}