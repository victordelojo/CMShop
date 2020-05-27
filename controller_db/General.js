module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.getInformacionEmpresa = async function() {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var salida = await dbo.collection("general").find({}, { _id: 0, nombreEmpresa: 1, localizacionEmpresa: 1, emailContacto: 1, descripcionEmpresa: 1 }).toArray();
        db.close()
        return salida[0]
    }

    this.setInformacioEmpresa = async function(datos) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        await dbo.collection("general").updateOne({}, { $set: { datos } });
        db.close()
    }

}