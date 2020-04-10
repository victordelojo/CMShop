addEventListener("click",inicio)

function inicio(){
    document.getElementById("btn-menu").addEventListener("click",menu)
}
var boton = true
function menu(e){
    if(boton){
        document.getElementById("menu").style.display="inline-block";
    }else{
        document.getElementById("menu").style.display="none";
    }
    boton=!boton
    
}
$(document).ready(function () {
    $(".modal a").not(".dropdown-toggle").on("click", function () {
        $(".modal").modal("hide");
    });
});
