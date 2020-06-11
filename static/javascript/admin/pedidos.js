addEventListener("load", cargar)
var hrf = ["?", "?", "?"]

idAnular=""

function cargar() {
    redirec()
    document.getElementById("atras0").href += hrf[0]
    document.getElementById("atras").href += hrf[1]
    document.getElementById("siguiente").href += hrf[2]
    var aux= document.getElementsByClassName("anular");
    for(let i=0;i<aux.length;i++){
        aux[i].addEventListener("click",function(e){
            idAnular=e.target.value
        })
    }
    document.getElementById("anularPedido").addEventListener("click",anular)
}

function anular(){
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function() {
        if (this.readyState == 4 && this.status == 200) {
            var datos = JSON.parse(this.responseText);
            if (datos.estado) {
                location.reload()
            } else {
                $('#anular').modal('hide')
                document.getElementById("alerta").innerHTML = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>\
                <strong>" + datos.error + "</strong>\
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\
                    <span aria-hidden='true'>&times;</span>\
                </button>\
                </div>"
            }
        }
    })
    xhttp.open("POST", "/" + conf.adminD + "/pedidos/anular", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + idAnular);
}

function redirec() {
    var aux = location.search.substr(1);
    var aux = aux.split("&")
    console.log(aux)
    for (let i = 0; i < aux.length; i++) {
        let aux1 = aux[i].split("=")
        console.log(aux1)
        switch (aux1[0]) {
            case "client":
            case "id":
                console.log(aux[i])
                if (i == 0) {
                    hrf[0] += aux[i]
                    hrf[1] += aux[i]
                    hrf[2] += aux[i]
                } else {
                    hrf[0] += "&" + aux[i]
                    hrf[1] += "&" + aux[i]
                    hrf[2] += "&" + aux[i]
                }
                break;
            case "num":
                console.log(parseInt(aux1[1]))
                if (parseInt(aux1[1]) - 5 < 0) {
                    if (i == 0) {
                        hrf[1] += aux1[0] + "=0"
                    } else {
                        hrf[1] += "&" + aux1[0] + "=0"
                    }
                } else {
                    if (i == 0) {
                        hrf[1] += aux1[0] + "=" + (parseInt(aux1[1]) - 5)
                    } else {
                        hrf[1] += "&" + aux1[0] + "=" + (parseInt(aux1[1]) - 5)
                    }
                }
                if (i == 0) {
                    hrf[2] += aux1[0] + "=" + (parseInt(aux1[1]) + 5)
                } else {
                    hrf[2] += "&" + aux1[0] + "=" + (parseInt(aux1[1]) + 5)
                }
                break;
        }
    }
    console.log(hrf)
}