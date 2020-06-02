module.exports = function(url, bd_nombre) {
    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.getPedidosByCorreo = async function(usu) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuario = await dbo.collection("usuarios").find({ correo: usu, pedidos: { $exists: true } }, { _id: 0, pedidos: 1 }).toArray()
        var pedidos = []
        var estados = ["No pagado", "Pagado", "Confirmado", "En preparación", "Preparado", "Enviado", "Entregado", "Anulado"];
        if (usuario.length != 0) {
            pedidos = await dbo.collection("pedidos").find({ _id: { $in: usuario[0].pedidos } }).sort({ $natural: -1 }).toArray()
            for (let i = 0; i < pedidos.length; i++) {
                pedidos[i].estado = estados[pedidos[i].estado]
            }
        }
        db.close();
        return pedidos;
    }

    this.getPedidosSkip = async function(num) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({}).sort({ $natural: -1 }).skip(num).limit(5).toArray()
        db.close();
        return pedidos;
    }
    this.getPedidosSkipByUsu = async function(num, usu) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var usuario = await dbo.collection("usuarios").find({ _id: new this.mongodb.ObjectId(usu), pedidos: { $exists: true } }, { _id: 0, pedidos: 1 }).toArray()
        var pedidos = []
        if (usuario.length != 0) {
            pedidos = await dbo.collection("pedidos").find({ _id: { $in: usuario[0].pedidos } }).sort({ $natural: -1 }).skip(num).limit(5).toArray()
        }
        db.close();
        return pedidos;
    }

    this.getNumeroPedidos = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({}).toArray()
        db.close();
        var total = 0
        for (var i = 0; i < pedidos.length; i++) {
            total += pedidos[i].length;
        }
        return total;
    }

    this.getNumeroPedidosByUsu = async function(usu) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("usuarios").find({ _id: new this.mongodb.ObjectId(usu) }, { _id: 0, pedidos: 1 }).toArray()
        db.close();
        return pedidos[0].length;
    }
    this.pasarEstado = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var aux = await dbo.collection("pedidos").find({ _id: new this.mongodb.ObjectId(id) }, { _id: 0, estado: 1 }).toArray()
        if (aux[0] && aux[0].estado < 6) {
            await dbo.collection("pedidos").updateOne({ _id: new this.mongodb.ObjectId(id) }, { $inc: { estado: 1 } })
        } else {
            db.close();
            return false;
        }
        db.close();
        return true;
    }
}