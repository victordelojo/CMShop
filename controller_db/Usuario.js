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
            return false;
        }
        await dbo.collection("usuarios").deleteOne({ _id: new this.mongodb.ObjectId(id) });
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
            return false;
        }
        await dbo.collection("usuarios").insertOne(datos);
        return true;
    }
}