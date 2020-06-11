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
        var existe = await dbo.collection("categorias").find({ nombre: datos.nombre }).toArray();
        if (existe.length == 0) {
            await dbo.collection("categorias").insertOne(datos);
            db.close()
            return true;
        }
        db.close()
        return false;
    }
    this.getCategoriaById = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var salida = await dbo.collection("categorias").find({ _id: new this.mongodb.ObjectId(id) }).toArray();
        if (salida.length == 0) {
            return false;
        } else {
            return salida[0];
        }
    }
    this.getnombreCategorias = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        return await dbo.collection("categorias").find({}, { _id: 1, nombre: 1 }).toArray();
    }
    this.getCategorias = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        let salida2 = await dbo.collection("categorias").find({}).toArray();
        let productos = await dbo.collection("productos").aggregate([{ $group: { _id: "$categoria", total: { $sum: 1 } } }]).toArray()
        var salida = []
        var aux;
        for (let i = 0; i < salida2.length; i++) {
            aux = false;
            for (let x = 0; x < productos.length; x++) {

                //Para compara 2 ids se necesitan el método equals para compara ya que es un objeto y no un String
                if (salida2[i]._id.equals(productos[x]._id)) {
                    salida[i] = { id: salida2[i]._id, nombre: salida2[i].nombre, productos: productos[x].total, ganancias: salida2[i].ganancias };
                    aux = true;
                }
            }
            if (!aux) {
                salida[i] = {
                    id:salida2[i]._id,
                    nombre: salida2[i].nombre,
                    productos: 0,
                    ganancias: salida2[i].ganancias
                }
            }
        }
        db.close()
        return salida;
    }

    this.sumarGanancias = async function(id, precio) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        await dbo.collection("categorias").update({ _id: new this.mongodb.ObjectId(id) }, { $inc: { ganancias: precio } })
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

    this.borrar = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var categoria = await dbo.collection("categorias").find({ nombre: datos.nombre }).toArray();
        if (categoria.length > 0) {
            await dbo.collection("productos").updateMany({ categoria: new this.mongodb.ObjectId(categoria[0]._id) }, { $unset: { categoria: "" } })
            await dbo.collection("categorias").deleteOne({ nombre: datos.nombre });
            db.close();
            return true;
        }
        db.close();
        return false;
    }

    this.editar = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var categoria = await dbo.collection("categorias").find({ nombre: datos.nombreA }).toArray();
        if (categoria.length == 1) {
            await dbo.collection("categorias").updateOne({ nombre: datos.nombreA }, { $set: { nombre: datos.nombreN } })
            db.close()
            return true;
        }
        db.close()
        return false;
    }

    /*
    dbo.collection("prueba").find({}).toArray(function(err, result){ // Muestra todos los registros
      console.log(result); 
    });*/
}