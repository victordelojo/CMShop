module.exports = function (url, bd_nombre) {
    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.getPedidosSkip=async function(num){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({}, { _id: 0,pedidos:1 }).skip(num).limit(5).toArray()
        db.close();
        return pedidos;
    }
    this.getPedidosByUsu=async function(num,usu){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({nombre:usu}, { _id: 0,pedidos:1 }).skip(num).limit(5).toArray()
        db.close();
        return pedidos;
    }

    this.getNumeroPedidos = async function(){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({}, { _id: 0,pedidos:1 }).toArray()
        db.close();
        var total=0
        for(var i=0;i<pedidos.length;i++){
            total+=pedidos[i].length;
        }
        return total;
    }

    this.getNumeroPedidosByUsu=async function(usu){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var pedidos = await dbo.collection("pedidos").find({nombre:usu}, { _id: 0,pedidos:1 }).toArray()
        db.close();
        return pedidos[0].length;
    }
}