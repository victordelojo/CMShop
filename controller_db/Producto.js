module.exports = function(url, bd_nombre) {

    this.mongodb = require('mongodb'); // 
    this.f = require('util').format;
    assert = require('assert');
    this.url = url;
    this.bd_nombre = bd_nombre;

    this.getProductosAjax = async function(num = 0) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("productos").find({ categoria: { $exists: true } }).sort({ $natural: -1 }).toArray()
        db.close();
        return productos;
    }

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
    this.getProductosByCategoria = async function(num, cat) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("productos").find({ categoria: new this.mongodb.ObjectId(cat) }).skip(num).limit(4).toArray()
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

    this.getNumTotalProductosByCategoria = async function(cat) {
        let db = await this.mongodb.MongoClient.connect(this.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        const dbo = db.db(this.bd_nombre);
        var productos = await dbo.collection("productos").find({ categoria: new this.mongodb.ObjectId(cat) }).toArray()
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
                    // UTILIZAMOS EL  OPERADOR AND YA QUE SI NO UTILIZAMOS SOLO REALIZA EL ULTIMO PARAMETRO DEL MISMO NOMBRE EN ESTA OCASIÓN $LT
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-0" + mes + "-01") } }, { fechaInicio: { $lt: new Date(anio + "-10-01") } }] }).toArray()
                } else {
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-0" + mes + "-01") } }, { fechaInicio: { $lt: new Date(anio + "-0" + (mes + 1) + "-01") } }] }).toArray()
                }
            } else {
                if (mes == 12) {
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-" + mes + "-01") } }, { fechaInicio: { $lt: new Date((anio + 1) + "-01-01") } }] }).toArray()
                } else {
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-" + mes + "-01") } }, { fechaInicio: { $lt: new Date(anio + "-" + (mes + 1) + "-01") } }] }).toArray()
                }
            }
            if (aux.length == 0) {
                salida[i - 1] = 0;
            } else {
                /**/
                salida[i - 1] = aux.length;
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
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-0" + mes + "-01") } }, { fechaInicio: { $lt: new Date(anio + "-10-01") } }] }).toArray()
                } else {
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-0" + mes + "-01") } }, { fechaInicio: { $lt: new Date(anio + "-0" + (mes + 1) + "-01") } }] }).toArray()
                }
            } else {
                if (mes == 12) {
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-" + mes + "-01") } }, { fechaInicio: { $lt: new Date((anio + 1) + "-01-01") } }] }).toArray()
                } else {
                    aux = await dbo.collection("pedidos").find({ $and: [{ fechaInicio: { $gte: new Date(anio + "-" + mes + "-01") } }, { fechaInicio: { $lt: new Date(anio + "-" + (mes + 1) + "-01") } }] }).toArray()
                }
            }
            if (aux.length == 0) {
                salida[i - 1] = 0;
            } else {
                var aux2 = 0;
                for (var x = 0; x < aux.length; x++) {
                    for (var y = 0; y < aux[x].contenido.length; y++) {
                        var aux3 = await this.getProductoById(aux[x].contenido[y].producto)
                        aux2 += (aux[x].contenido[y].cantidad * aux3.precio)
                    }
                }
                salida[i - 1] = aux2;
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

}