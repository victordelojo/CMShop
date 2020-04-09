
/*

LA CONEXIÓN CON LA BASE DE DATOS ES ASINCRONA Y PARA QUE PUEDA RECIBIR LOS DATOS DE LA BASE DE DATOS ANTES QUE ENVIE LA RESPUESTA DEBE DE 
PONER EN LA CONEXION "await" PARA QUE ESPERE LA LLEGADA DE LOS DATOS ANTES DE SEGUIR CON EL ENVIO DE DATOS.

*/



module.exports = function (url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.insertar = async function (datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        return dbo.collection("categorias").insertOne(datos);


    }
    this.getCategorias = async function(){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var salida2 = await dbo.collection("categorias").find({},{_id:0,name:1}).toArray();
        db.close()
        var salida=[]
        salida2.forEach(element => {
            salida.push(element.name+"")
        });
        return salida;
    }

    /*
    dbo.collection("prueba").find({}).toArray(function(err, result){ // Muestra todos los registros
      console.log(result); 
    });*/
}
