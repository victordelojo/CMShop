module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;


    this.getUsuarios=async function(num){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("usuarios").find({},{pedidos:0}).skip(num).limit(4).toArray()
        db.close();
        return productos;
    }

    this.getNumTotalUsuarios=async function(){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("usuarios").find({}).toArray()
        db.close();
        return productos.length;
    }
}