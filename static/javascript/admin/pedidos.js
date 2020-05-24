addEventListener("load", cargar)
var hrf = ["?", "?", "?"]

function cargar() {
    redirec()
    document.getElementById("atras0").href += hrf[0]
    document.getElementById("atras").href += hrf[1]
    document.getElementById("siguiente").href += hrf[2]

}

function redirec() {
    var aux = location.search.substr(1);
    var aux = aux.split("&")

    for (let i = 0; i < aux.length; i++) {
        let aux1 = aux[i].split("=")
        switch (aux1[0]) {
            case "client":
            case "id":
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