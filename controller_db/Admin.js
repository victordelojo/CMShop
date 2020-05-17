
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
        await dbo.collection("general").insertOne(datos);
        db.close()


    }
    this.comprobarInicio = async function () {

        // Sincrono
        try{
            var db = await this.mongodb.MongoClient.connect(this.url, {
                useUnifiedTopology: true,// Usar el nuevo motor de tipografia
                useNewUrlParser: true,// Usa la herramienta para analizar las cadenas de conexión con mongoDB
            })
        }catch(error){
            return 0
        }
        const dbo = db.db(this.bd_nombre);
        //dbo.collection("general").countDocuments()  CUENTA LOS DOCUMENTOS QUE HAY EN ESA COLECCIÓN
        let thing = await dbo.collection("general").find({},{_id:0,nombreAdmin:1,contraAdmin:1}).toArray();
        await db.close();
        if (thing.length > 0 && thing[0].nombreAdmin!=="" && thing.contraAdmin!=="") {
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
        let thing = await dbo.collection("general").countDocuments(admin);
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
        let thing = await dbo.collection("general").find({ nombreAdmin: admin }).toArray();
        await db.close();
        return thing[0];
    }

    this.cambiarContra = async function (contra) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,// Usar el nuevo motor de tipografia
            useNewUrlParser: true,// Usa la herramienta para analizar las cadenas de conexión con mongoDB
        });
        const dbo = db.db(this.bd_nombre);
        try {
            await dbo.collection("general").updateOne({}, { $set: { contraAdmin: contra } });
            db.close();
            return true
        } catch (error) {
            db.close();
            console.log(error)
            return false
        }

    }

    this.cambiarDatos = async function(datos){
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,// Usar el nuevo motor de tipografia
            useNewUrlParser: true,// Usa la herramienta para analizar las cadenas de conexión con mongoDB
        });
        const dbo = db.db(this.bd_nombre);
        try {
            await dbo.collection("general").updateOne({}, { $set: datos });
            db.close();
            return true
        } catch (error) {
            db.close();
            console.log(error)
            return false
        }
    }

    /*
    dbo.collection("prueba").find({}).toArray(function(err, result){ // Muestra todos los registros
      console.log(result); 
    });*/
}
