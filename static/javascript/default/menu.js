var xhttp1 = new XMLHttpRequest();
xhttp1.addEventListener("readystatechange", function() {
    if (this.readyState == 4 && this.status == 200) {
        var datos = JSON.parse(this.responseText);
        datos.forEach(element => {
            var categorias = document.getElementById("categorias");
            var aux = document.createElement("a")
            aux.classList.add("dropdown-item")
            aux.href = "/categoria?categoria=" + element.id
            aux.innerHTML = element.nombre;
            categorias.appendChild(aux)
        });
    }
})
xhttp1.open("POST", "/ajax/categorias", true);
xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp1.send();
document.getElementById("buscar").addEventListener("keyup", buscar)
document.getElementById("btnBuscar").addEventListener("click", buscar)

function buscar() {
    var pulsado = event.which || event.keyCode || "boton"
    if (document.getElementById("buscar").value != "" && (pulsado == 13 || pulsado == 1)) {
        location.href = "/busqueda?nombre=" + document.getElementById("buscar").value
    }
}