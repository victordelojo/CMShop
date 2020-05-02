module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.insertar = async function(cliente, datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        await dbo.collection("clientes").update({ _id: cliente }, { $push: { pedidos: { datos } } });
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