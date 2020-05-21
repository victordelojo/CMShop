var xhttp1 = new XMLHttpRequest();
xhttp1.addEventListener("readystatechange", function() {
    if (this.readyState == 4 && this.status == 200) {
        var datos = JSON.parse(this.responseText);
        datos.forEach(element => {
            var categorias = document.getElementById("categorias");
            var aux = document.createElement("a")
            aux.classList.add("dropdown-item")
            aux.href = "/productos/" + element.nombre
            aux.innerHTML = element.nombre;
            categorias.appendChild(aux)
        });
    }
})
xhttp1.open("POST", "/ajax/categorias", true);
xhttp1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp1.send();