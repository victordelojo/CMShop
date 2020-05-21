addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado == false) {
                document.getElementById("productos").innerHTML = "No hay productos"
            } else {
                for (let i = 0; i < 3 && i < datos.length; i++) {
                    var carr = document.getElementById("fotosCar")
                    var uno = document.createElement("div")
                    uno.classList.add("carousel-item")
                    if (i == 0) {
                        uno.classList.add("active")
                    }
                    var imgUno = document.createElement("img")
                    imgUno.classList.add("d-block")
                    imgUno.classList.add("w-100")
                    imgUno.classList.add("img-fluid")
                    imgUno.style.maxHeight = "400px"
                    imgUno.src = "../fotos/" + datos[i].foto[0]
                    imgUno.alt = i + " slide"
                    var divUno = document.createElement("div")
                    divUno.classList.add("carousel-caption")
                    divUno.classList.add("d-none")
                    divUno.classList.add("d-md-block")
                    var btnUno = document.createElement("button")
                    btnUno.classList.add("btn")
                    btnUno.classList.add("btn-outline-dark")
                    btnUno.innerHTML = "VER"
                    btnUno.value = datos[i]._id
                    divUno.appendChild(btnUno)
                    uno.appendChild(imgUno)
                    uno.appendChild(divUno)
                    carr.appendChild(uno)
                }
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
                    document.getElementById("productos").appendChild(a)
                }
            }
        }
    })
    xhttp.open("POST", "/ajax/productos", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}