module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;


    this.getUsuarios = async function(num) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({}, { pedidos: 0 }).skip(num).limit(5).toArray()
        db.close();
        return usuarios;
    }

    this.getUsuarioById = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuario = await dbo.collection("usuarios").find({ _id: new this.mongodb.ObjectId(id) }, { pedidos: 0 })
        db.close();
        return usuario[0];
    }

    this.getUsuarioByCorreo = async function(correo) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuario = await dbo.collection("usuarios").find({ correo: correo }, { pedidos: 0 }).toArray()
        db.close();
        return usuario[0];
    }

    this.isUsuarioByCorreo = async function(correo, contra) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuario = await dbo.collection("usuarios").find({ correo: correo, contra: contra }).toArray()
        if (usuario.length == 1) {
            return true;
        }
        return false;
    }

    this.getUsuariosByNombre = async function(num, nombre) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        if (await this.getNumTotalUsuariosByNombre(nombre) > 0) {
            var usuarios = await dbo.collection("usuarios").find({ nombre: { $regex: nombre, $options: "i" } }, { pedidos: 0 }).skip(num).limit(5).toArray()
            db.close();
            return usuarios;
        } else {
            db.close();
            return [];
        }


    }

    this.getNumTotalUsuariosByNombre = async function(nombre) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({ nombre: { $regex: nombre, $options: "i" } }).toArray()
        db.close();
        return usuarios.length;
    }

    this.getNumTotalUsuarios = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({}).toArray()
        db.close();
        return usuarios.length;
    }

    this.borrar = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({ _id: new this.mongodb.ObjectId(id) }).toArray()
        if (usuarios.length == 0) {
            db.close();
            return false;
        }
        await dbo.collection("usuarios").deleteOne({ _id: new this.mongodb.ObjectId(id) });
        db.close();
        return true;
    }

    this.insertar = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({ correo: datos.correo }).toArray()
        if (usuarios.length > 0) {
            db.close();
            return false;
        }
        await dbo.collection("usuarios").insertOne(datos);
        db.close();
        return true;
    }

    this.update=async function(correo, datos){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({ correo: correo }).toArray()
        if (usuarios.length == 1) {
            await dbo.collection("usuarios").updateOne({correo:correo},{$set:datos})
            db.close();
            return true
        }
        db.close();
        return false;
    }

    this.pedidoNuevo = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuarios = await dbo.collection("usuarios").find({ correo: datos.correo }).toArray()
        if (usuarios.length == 0) {
            var id = new this.mongodb.ObjectId();
            var Categoria = require("../controller_db/Categoria")
            var Producto = require("../controller_db/Producto")
            var producto = new Producto(this.url, this.bd_nombre)
            var categoria = new Categoria(this.url, this.bd_nombre);
            for (let i = 0; i < datos.productos.length; i++) {
                var idCate = await producto.getProductoById(datos.productos[i]._id).categoria
                await categoria.sumarGanancias(idCate, datos.productos[i].cantidad * datos.productos[i].precio)
            }
            await dbo.collection("usuarios").updateOne({ correo: datos.correo }, { $push: { pedidos: new this.mongodb.ObjectId(id) } });
            await dbo.collection("pedidos").insertOne({ _id: new this.mongodb.ObjectId(id), contenido: datos.productos, estado: datos.estado, fechaInicio: new Date() })
            db.close();
            return true;
        }
        db.close();
        return false;
    }
}