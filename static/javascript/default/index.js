addEventListener("load", cargar)

function cargar() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            datos = JSON.parse(this.responseText);
            if (datos.estado == false) {
                document.getElementById("productos").innerHTML = "No hay productos"
            } else {
                console.log(datos)
                for (let i = 0; i < 9 && i < datos.length; i++) {
                    var a = document.createElement("div");
                    a.classList.add("col-12")
                    a.classList.add("col-sm-4")
                    a.classList.add("mb-5")
                    a.classList.add("text-center")
                    var img = document.createElement("img")
                    img.src = "../fotos/" + datos[i].foto[0]
                    img.classList.add("img-fluid")
                    img.classList.add("p-lg-5")
                    img.classList.add("p-md-3")
                    a.appendChild(img)
                    var nombre = document.createElement("h5")
                    nombre.innerHTML = datos[i].nombre
                    a.appendChild(nombre)
                    document.getElementById("productos").appendChild(a)
                }
                //document.getElementById("productos").innerHTML = datos
            }
        }
    })
    xhttp.open("POST", "/ajax/productos", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}