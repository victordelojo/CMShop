addEventListener("load", cargar);
var barra = 1;

function cargar() {
    document.getElementById("boton").addEventListener("click", function() {
        if (comprobar()) {
            siguiente();

        }
        return false;
    });
    document.getElementById("boton").addEventListener("submit", function() {
        event.preventDefault();
    });

    document.getElementById("sub").addEventListener("click", comprobar)
    document.getElementById("atras").addEventListener("click", atras)
    document.getElementById("atras2").addEventListener("click", atras2)
    document.getElementById("boton2").addEventListener("click", function() {
        if (comprobar2()) {
            siguiente2();
        }
        return false;
    })
    document.getElementById("boton2").addEventListener("submit", function() {
        event.preventDefault();
    })
    document.getElementById("barra").style.width = barra + "%";
    window.onresize = function() {
        if (window.innerWidth < 450) {
            window.innerWidth = 450;
        }
    }
    document.getElementById("db").style.display = "none";
    document.getElementById("host").style.display = "none";
    document.getElementById("Usu").style.display = "inline-block"
    $('#modal').modal("show");
}
var intervalo = null

function quitarBarra() {
    if (barra < 2) {
        clearInterval(intervalo)
    } else {
        barra--;
        document.getElementById("barra").style.width = barra + "%";
    }
}

function aniadirBarra() {
    if (barra > 49) {
        clearInterval(intervalo)
    } else {
        barra++;
        document.getElementById("barra").style.width = barra + "%";
    }
}

function quitarBarra2() {
    if (barra < 51) {
        clearInterval(intervalo)
    } else {
        barra--;
        document.getElementById("barra").style.width = barra + "%";
    }
}

function aniadirBarra2() {
    if (barra > 99) {
        clearInterval(intervalo)
    } else {
        barra++;
        document.getElementById("barra").style.width = barra + "%";
    }
}

function atras() {
    document.getElementById("host").style.display = "inline-block";
    document.getElementById("db").style.display = "none";
    clearInterval(intervalo)
    intervalo = setInterval(quitarBarra2, 5);
}

function atras2() {
    document.getElementById("host").style.display = "none";
    document.getElementById("Usu").style.display = "inline-block";
    clearInterval(intervalo)
    intervalo = setInterval(quitarBarra, 5);
}

function siguiente2() {
    document.getElementById("db").style.display = "inline-block";
    document.getElementById("host").style.display = "none";
    clearInterval(intervalo)
    intervalo = setInterval(aniadirBarra2, 5);
}

function comprobar() {
    if (document.getElementById("pass1").value.length < 8) {
        document.getElementById("pass1").setCustomValidity("Longitud de contraseña incorrecto " + document.getElementById("pass1").value.length);
        return false;
    } else {
        document.getElementById("pass1").setCustomValidity("");
    }
    if (document.getElementById("pass2").value != document.getElementById("pass1").value) {
        document.getElementById("pass2").setCustomValidity("La contraseña no coinciden")
        return false;
    } else {
        document.getElementById("pass2").setCustomValidity("")
    }
    return true;
    //document.getElementById("email").setCustomValidity("I am expecting an e-mail address!");
}

function comprobar2() {
    if (document.getElementById("nombreHost").value == "") {
        document.getElementById("nombreHost").setCustomValidity("Completa este campo")
        return false;
    }
    if (document.getElementById("portHost").value == "") {
        document.getElementById("portHost").setCustomValidity("Completa este campo")
        return false;
    }
    return true;
}

function siguiente() {
    document.getElementById("Usu").style.display = "none";
    document.getElementById("host").style.display = "inline-block";
    clearInterval(intervalo)
    intervalo = setInterval(aniadirBarra, 5);
}