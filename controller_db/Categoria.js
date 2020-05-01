/*

LA CONEXIÓN CON LA BASE DE DATOS ES ASINCRONA Y PARA QUE PUEDA RECIBIR LOS DATOS DE LA BASE DE DATOS ANTES QUE ENVIE LA RESPUESTA DEBE DE 
PONER EN LA CONEXION "await" PARA QUE ESPERE LA LLEGADA DE LOS DATOS ANTES DE SEGUIR CON EL ENVIO DE DATOS.

*/



module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.insertar = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        return dbo.collection("categorias").insertOne(datos);


    }
    this.getCategorias = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        let salida2 = await dbo.collection("categorias").find({}, { _id: 0, name: 1 }).toArray();
        db.close()
        let salida = []
        salida2.forEach(element => {
            salida.push("'" + element.name + "'")
        });
        return salida;
    }
    this.getPedidosPrecioDeCategorias = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        let categorias = await dbo.collection("categorias").find({}, { _id: 0, nombre: 1, ganancias: 1 }).sort({ ganancias: -1 }).limit(3).toArray(); //Obtiene las 3 categorias con más ganancias
        let total = await dbo.collection("categorias").aggregate([{ // Obtien todas las ganancias obtenidas
            $group: {
                _id: null,
                "total": { $sum: "$ganancias" }
            }
        }]).toArray();
        if (categorias.length == 0) {
            db.close();
            return ["'No hay categorias'", 0]
        }
        total = total[0].total
        let nombre = [];
        let ganancias = [];
        db.close();
        categorias.forEach(element => {
            nombre.push("'" + element.nombre + "'");
            ganancias.push("'" + element.ganancias + "'");
            total -= element.ganancias;
        })
        nombre.push("'otros'");
        ganancias.push(total)
        return [nombre, ganancias];
    }

    /*
    dbo.collection("prueba").find({}).toArray(function(err, result){ // Muestra todos los registros
      console.log(result); 
    });*/
}