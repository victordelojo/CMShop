module.exports = function(url, bd_nombre) {
    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.getPedidosByEstado = async function(est) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({ estado: parseInt(est) }).toArray()
        db.close();
        return pedidos
    }
    this.getPedidosByEstadoSkip = async function(est, num) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({ estado: parseInt(est) }).skip(num).limit(5).toArray()
        db.close();
        return pedidos
    }

    this.getPedidoById = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({ _id: new this.mongodb.ObjectId(id) }).toArray()
        db.close();
        if (pedidos.length == 1) {
            return pedidos[0]
        } else {
            return false
        }
    }

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
        return pedidos.length;
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
            if (aux[0].estado == 0) {
                var Producto = require("../controller_db/Producto")
                var producto = new Producto(this.url, this.bd_nombre)
                var Categoria = require("../controller_db/Categoria")
                var categoria = new Categoria(this.url, this.bd_nombre)
                for (let i = 0; i < aux[0].contenido.length; i++) {
                    var idCate = await producto.getProductoById(aux[0].contenido[i].producto)
                    await categoria.sumarGanancias(idCate.categoria, aux[0].contenido[i].cantidad * idCate.precio)
                }
            }
            await dbo.collection("pedidos").updateOne({ _id: new this.mongodb.ObjectId(id) }, { $inc: { estado: 1 } })
        } else {
            db.close();
            return false;
        }
        db.close();
        return true;
    }
    this.borrarPedidoById = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        try {
            var aux = await dbo.collection("pedidos").find({ _id: new this.mongodb.ObjectId(id) }).toArray()
            if (aux.length == 1 && aux[0].estado < 6) {
                var Producto = require("../controller_db/Producto")
                var productos = new Producto(this.url, this.bd_nombre)
                aux = aux[0]
                for (let i = 0; i < aux.contenido.length; i++) {
                    var aux2 = await productos.getProductoById(aux.contenido[i].producto)
                    await productos.actualizar(aux.contenido[i].producto, { cantidad: parseInt(aux2.cantidad) + parseInt(aux.contenido[i].cantidad) })
                }
                await dbo.collection("pedidos").updateOne({ _id: new this.mongodb.ObjectId(id) }, { $set: { estado: 7 } })
                db.close()
                return true
            } else {
                db.close()
                return false
            }
        } catch (error) {
            db.close()
            console.log(error)
            return false
        }


    }
}