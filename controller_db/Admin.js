
/*

LA CONEXIÓN CON LA BASE DE DATOS ES ASINCRONA Y PARA QUE PUEDA RECIBIR LOS DATOS DE LA BASE DE DATOS ANTES QUE ENVIE LA RESPUESTA DEBE DE 
PONER EN LA CONEXION "await" PARA QUE ESPERE LA LLEGADA DE LOS DATOS ANTES DE SEGUIR CON EL ENVIO DE DATOS.

*/



module.exports = function (url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.insertar = async function (datos) {
        /*
        await this.mongodb.connect(this.url, function (err, dba) { // Conecta con la base de datos
            assert.equal(null, err);
            var dbo = dba.db("CMShop");// Elige la base de datos
            dbo.collection(collection).insertOne(datos,function(err,res){//Inserta los datos
                if(err) throw err;
            })
        })*/
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        await dbo.collection("userAdmin").insertOne(datos);
        db.close()


    }
    this.comprobarInicio = async function () {

        // Sincrono
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,// Usar el nuevo motor de tipografia
            useNewUrlParser: true,// Usa la herramienta para analizar las cadenas de conexión con mongoDB
        });
        const dbo = db.db(this.bd_nombre);
        let thing = await dbo.collection("userAdmin").countDocuments();
        await db.close();
        if (thing > 0) {
            return true;
        }
        return false;
        /*

        Asincrono

        this.MongoClient.connect(this.url,async function (err, dba) {
            assert.equal(null, err);
            var dbo = dba.db("CMShop");
            dbo.collection("userAdmin").count({},function(error,numOfDocs){
                if(error) throw error;
                console.log(numOfDocs+" dirver.js:35")
                
                if (numOfDocs>0){
                    return true;
                }
                return false;
            })
            
        })*/
    }
    this.comprobarAdmin = async function (admin) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,// Usar el nuevo motor de tipografia
            useNewUrlParser: true,// Usa la herramienta para analizar las cadenas de conexión con mongoDB
        });
        const dbo = db.db(this.bd_nombre);
        let thing = await dbo.collection("userAdmin").countDocuments(admin);
        await db.close();
        if (thing > 0) {
            return true;
        }
        return false;
    }
    this.recojerDatos = async function (admin) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,// Usar el nuevo motor de tipografia
            useNewUrlParser: true,// Usa la herramienta para analizar las cadenas de conexión con mongoDB
        });
        const dbo = db.db(this.bd_nombre);
        let thing = await dbo.collection("userAdmin").find({nombre:admin}).toArray();
        await db.close();
        return thing[0];
    }

    /*
    dbo.collection("prueba").find({}).toArray(function(err, result){ // Muestra todos los registros
      console.log(result); 
    });*/
}
