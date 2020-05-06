module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.getProductos = async function(num = 0) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("productos").find({}).skip(num).limit(4).toArray()
        db.close();
        return productos;
    }

    this.getNumTotalProductos = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("productos").find({}).toArray()
        db.close();
        return productos.length;
    }

    this.getFotosByProductoId = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("productos").find({ _id: new this.mongodb.ObjectId(id) }, { _id: 0, foto: 1 }).toArray()
        db.close();
        if (productos.length > 0) {
            return productos[0].foto
        }
        return false;
    }

    this.getProductoById = async function(id) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var producto = await dbo.collection("productos").find({ _id: new this.mongodb.ObjectId(id) }).toArray();
        db.close();
        return producto[0];
    }

    this.insertarPedido = async function(cliente, datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        await dbo.collection("clientes").updateOne({ _id: cliente }, { $set: { datos } });
        db.close();
    }

    this.borrarFotoProductoById = async function(id, foto) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var fotos = await this.getFotosByProductoId(id);
        var aux = []
        for (var i = 0; i < fotos.length; i++) {
            if (fotos[i] != foto) {
                aux.push(fotos[i]);
            }
        }
        var datos = { foto: aux }
        await dbo.collection("productos").updateOne({ _id: new this.mongodb.ObjectId(id) }, { $set: datos });
        db.close();
    }

    this.actualizar = async function(antiguo, nuevo) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        nuevo.categoria = new this.mongodb.ObjectId(nuevo.categoria);
        const dbo = db.db(this.bd_nombre);
        await dbo.collection("productos").updateOne({ _id: new this.mongodb.ObjectId(antiguo) }, { $set: nuevo })
        db.close()
        return true;
    }

    this.borrar = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        try {
            await dbo.collection("productos").removeOne({ _id: new this.mongodb.ObjectId(datos) })
            return { estado: true };
        } catch (e) {
            return { estado: false, error: "No se a podido borrar el producto de la base de datos" };
        }

    }

    this.insertar = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        datos.categoria = new this.mongodb.ObjectId(datos.categoria)
        await dbo.collection("productos").insertOne(datos);
        db.close();
    }

    this.insertarFotoById = async function(id, foto) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var fotos = await this.getFotosByProductoId(id);
        fotos.push(foto)
        await dbo.collection("productos").updateOne({ _id: new this.mongodb.ObjectId(id) }, { $set: { foto: fotos } })
        db.close();
    }

    this.totalProductosMensuales = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var mes = new Date().getMonth();
        var anio = new Date().getFullYear();
        mes += 1;
        var salida = [];
        for (i = 4; i > 0; i--) {
            var aux;
            if (mes < 10) {
                if (mes == 9) {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-0" + mes + "-01"), $lt: new Date(anio + "-10-01") } } }, { $group: { _id: null, total: { $sum: 1 } } }]).toArray()
                } else {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-0" + mes + "-01"), $lt: new Date(anio + "-0" + (mes + 1) + "-01") } } }, { $group: { _id: null, total: { $sum: 1 } } }]).toArray()
                }
            } else {
                if (mes == 12) {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-" + mes + "-01"), $lt: new Date((anio + 1) + "-01-01") } } }, { $group: { _id: null, total: { $sum: 1 } } }]).toArray()
                } else {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-" + mes + "-01"), $lt: new Date(anio + "-" + (mes + 1) + "-01") } } }, { $group: { _id: null, total: { $sum: 1 } } }]).toArray()
                }
            }
            if (aux.length == 0) {
                salida[i - 1] = 0;
            } else {
                salida[i - 1] = aux[0].total;
            }
            if (mes == 1) {
                mes = 12;
                anio--;
            } else {
                mes--;
            }
        }
        db.close();
        return salida;
    }
    this.getGananciasMensuales = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var mes = new Date().getMonth();
        var anio = new Date().getFullYear();
        mes += 1;
        var salida = [];
        for (i = 4; i > 0; i--) {
            var aux;
            if (mes < 10) {
                if (mes == 9) {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-0" + mes + "-01"), $lt: new Date(anio + "-10-01") } } }, { $group: { _id: "$pedidos.producto", total: { $sum: 1 } } }]).toArray()
                } else {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-0" + mes + "-01"), $lt: new Date(anio + "-0" + (mes + 1) + "-01") } } }, { $group: { _id: "$pedidos.producto", total: { $sum: 1 } } }]).toArray()
                }
            } else {
                if (mes == 12) {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-" + mes + "-01"), $lt: new Date((anio + 1) + "-01-01") } } }, { $group: { _id: "$pedidos.producto", total: { $sum: 1 } } }]).toArray()
                } else {
                    aux = await dbo.collection("clientes").aggregate([{ $unwind: "$pedidos" }, { $match: { 'pedidos.fecha': { $gte: new Date(anio + "-" + mes + "-01"), $lt: new Date(anio + "-" + (mes + 1) + "-01") } } }, { $group: { _id: "$pedidos.producto", total: { $sum: 1 } } }]).toArray()
                }
            }
            if (aux.length == 0) {
                salida[i - 1] = 0;
            } else {
                salida[i - 1] = aux;
            }
            if (mes == 1) {
                mes = 12;
                anio--;
            } else {
                mes--;
            }
        }
        var aux1;
        var salida1 = [];
        for (i = 0; i < salida.length; i++) {
            if (Array.isArray(salida[i])) {
                var suma = 0;
                for (x = 0; x < salida[i].length; x++) {
                    aux1 = await dbo.collection("productos").find({ _id: new this.mongodb.ObjectId(salida[i][x]._id) }, { _id: 0, precio: 1 }).toArray();
                    suma += aux1[0].precio * salida[i][x].total;
                }
                salida1.push(suma);
            } else {
                salida1.push(0);
            }
        }
        db.close();

        return salida1;
    }

}