var express = require('express');
var app = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var Categoria = require("../controller_db/Categoria")
var Producto = require("../controller_db/Producto")
var Usuario = require("../controller_db/Usuario")
var Pedidos = require("../controller_db/Pedidos")
var General = require("../controller_db/General")
var path = require("path")

var comprobarpost = async function(req, res, next) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.admin) {
                return next();
            } else {
                res.json({ estado: false, error: "No estas logueado como administrador" });
            }
        } else {
            res.json({ estado: false, error: "No existe un usuario administrador" });
        }
    } else {
        res.json({ estado: false, error: "No existe una configuración de CMShop" })
    }
}

var comprobarget = async function(req, res, next) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        var aux = await usuAdmin.comprobarInicio();
        if (aux === 0) {
            res.status(504).sendFile('/504.html', { root: __dirname + "/../static" });
        } else {
            if (aux) {
                if (req.session.admin) {
                    return next();
                } else {
                    res.redirect("/" + DB_CONF.Direccion_Admin + "/login");
                }
            } else {
                res.redirect("/");
            }
        }
    } else {
        res.redirect("/confCMShopUser");
    }
}


app.get("/reiniciar", async function(req, res) { //Cambia los parámetros del archivo de configuración y reinicia el servicio
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    await fs.writeFileSync(__dirname + '/../CONFIGURE.json', JSON.stringify({
        "_comentario": "Configuración de la base de datos",

        "db_user": DB_CONF.db_user,
        "db_auth": DB_CONF.db_auth,
        "db_pass": DB_CONF.db_pass,
        "db_port": DB_CONF.db_port,
        "db_direccion": DB_CONF.db_direccion,
        "db_name": DB_CONF.db_name,


        "_comentario": "Configuración del Sitio Web",

        "direccion": "martin27.ddns.net",
        "port": 3000,
        "Direccion_Admin": "admin"
    }, null, 4));
    var exec = require('child_process').exec,
        child;
    child = exec('pm2 restart app.js')
    res.redirect("http://" + DB_CONF.direccion + ":" + 3000 + "/" + DB_CONF.Direccion_Admin)
})

app.get("/", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var categorias = new Categoria(url, DB_CONF.db_name);
    var productos = new Producto(url, DB_CONF.db_name)
    var ganancaiasCategorias = await categorias.getPedidosPrecioDeCategorias();
    var pedidosMensuales = await productos.totalProductosMensuales();
    var gananciasMesnuales = await productos.getGananciasMensuales();
    var meses = ["'Enero'", "'Febrero'", "'Marzo'", "'Abril'", "'Mayo'", "'Junio'", "'Julio'", "'Agosto'", "'Septiembre'", "'Octubre'", "'Noviembre'", "'Diciembre'"];
    var mes = new Date().getMonth();
    var aux = []
    for (i = 3; i >= 0; i--) {
        aux[i] = meses[mes]
        if (mes == 0) {
            mes = 11;
        } else {
            mes--;
        }
    }
    var charts = `
          new Chart(document.getElementById('ganancias'), {
            type: 'line',
            data: {
                labels: [${aux.toString()}],
                datasets: [{
                    data: [${gananciasMesnuales}],
                    label: 'Euros',
                    borderColor: '#3e95cd',
                    fill: true
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Ganancias en los ultimos meses'
                }
            }
        });
        
        new Chart(document.getElementById('pedidos'), {
            type: 'line',
            data: {
                labels: [${aux.toString()}],
                datasets: [{
                    data: [${pedidosMensuales}],
                    label: 'Nº pedidos',
                    borderColor: '#3cba9f',
                    fill: true
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Numeros de pedidos realizados'
                }
            }
        });
        
        new Chart(document.getElementById('pagos'), {
            type: 'pie',
            data: {
              labels: [${ganancaiasCategorias[0]}],
              datasets: [{
                label: '',
                backgroundColor: ['#3e95cd', '#8e5ea2','#3cba9f','#e8c3b9'],
                data: [${ganancaiasCategorias[1]}]
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Ganancias por categorias',
              }
            }
        });
        
        `
    res.render("./admin/admin.pug", { location: "ESTADISTICAS", charts, "adminD": DB_CONF.Direccion_Admin })
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------LOGIN-------------------------------------------------------------------------------------------------------------------------------

app.get('/login', async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    res.render("./admin/adminLogin.pug", { "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })
})

app.post('/login/comprobar', async function(req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarAdmin({ "nombreAdmin": req.body.nombre, "contraAdmin": req.body.pass })) {
            req.session.admin = req.body.nombre;
            res.json({ estado: true });
        } else {
            res.json({ estado: false });
        }
    } else {
        res.json({ estado: false });
    }
    // **************************************************************************************************************************************************
    // **************************************************************************************************************************************************
    //----------USUARIOS-------------------------------------------------------------------------------------------------------------------------------

})
app.get('/usuarios', comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuarios = new Usuario(url, DB_CONF.db_name)
    var num = parseInt(req.query.num) || 0
    var nombre = req.query.nombre || 0
    if (nombre != 0) {
        if (num >= await usuarios.getNumTotalUsuariosByNombre(nombre)) {
            num -= 5
        }
        if (num < 0) {
            num = 0
        }
        var usuario = await usuarios.getUsuariosByNombre(num, nombre);
    } else {
        if (num >= await usuarios.getNumTotalUsuarios()) {
            num -= 5
        }
        if (num < 0) {
            num = 0
        }
        var usuario = await usuarios.getUsuarios(num);
    }

    for (var i = 0; i < usuario.length; i++) {
        var aux = "";
        for (var x = 0; x < usuario[i].contra.length; x++) {
            aux += "*";
        }
        usuario[i].contra = aux;
    }
    res.render('./admin/usuario.pug', {
        location: "Usuarios",
        usuarios: usuario,
        "adminD": DB_CONF.Direccion_Admin,
        "port": DB_CONF.port,
        "host": DB_CONF.direccion,
        "num": num,
        "nombre": nombre
    })
})

app.post("/usuarios/insertar", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuario = new Usuario(url, DB_CONF.db_name);
    if (await usuario.insertar(req.body)) {
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "Ya existe un usuario con ese correo" });
    }
})

app.post("/usuarios/borrar", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuario = new Usuario(url, DB_CONF.db_name);
    if (await usuario.borrar(req.body.id)) {
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "No se a podido borrar el usuario" });
    }
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CATEGORIAS-------------------------------------------------------------------------------------------------------------------------------

app.get("/categorias", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    var categoriasT = new Categoria(url, DB_CONF.db_name);
    var categoriasTo = await categoriasT.getCategorias();
    res.render('./admin/categorias.pug', { location: "Categorias", categorias: categoriasTo, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })

})
app.post("/categorias/insertar", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var categorias = new Categoria(url, DB_CONF.db_name);
    var insertar = await categorias.insertar({ nombre: req.body.nombre, ganancias: 0 });
    if (insertar) {
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "Ya existe esa categoría" });
    }
})

app.post("/categorias/borrar", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var categorias = new Categoria(url, DB_CONF.db_name);
    var borrar = await categorias.borrar({ nombre: req.body.nombre });
    if (borrar) {
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "No existe esa categoría" });
    }
})
app.post("/categorias/editar", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var categorias = new Categoria(url, DB_CONF.db_name);
    var editar = await categorias.editar({ nombreA: req.body.nombreA, nombreN: req.body.nombreN });
    if (editar) {
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "Ya existe esa categoría" });
    }
})


// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------PRODUCTOS-------------------------------------------------------------------------------------------------------------------------------


app.get("/productos", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    var num = parseInt(req.query.num) || 0
    var cat = req.query.cat || 0
    var categorias = new Categoria(url, DB_CONF.db_name)
    if (cat != 0) {
        if (num >= await productos.getNumTotalProductosByCategoria(cat)) {
            num -= 4
        }
        if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductosByCategoria(num, cat);
    } else {
        if (num >= await productos.getNumTotalProductos()) {
            num -= 4
        }
        if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductos(num);
    }
    for (var i = 0; i < productosSalida.length; i++) {
        let aux = await categorias.getCategoriaById(productosSalida[i].categoria)
        productosSalida[i].categoria = aux.nombre;
        if (productosSalida[i].descripcion.length > 50) {
            productosSalida[i].descripcion = productosSalida[i].descripcion.substr(0, 49);
            productosSalida[i].descripcion += "..."
        }
    }
    res.render('./admin/productos.pug', { location: "Productos", categorias: await categorias.getnombreCategorias(), productos: productosSalida, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, "num": num, "cat": cat })

})

app.get("/fotos", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    var categorias = new Categoria(url, DB_CONF.db_name)
    var num = parseInt(req.query.num) || 0
    var cat = req.query.cat || 0
    if (cat != 0) {
        if (num >= await productos.getNumTotalProductosByCategoria(cat)) {
            num -= 4
        }
        if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductosByCategoria(num, cat);
    } else {
        if (num >= await productos.getNumTotalProductos()) {
            num -= 4
        }
        if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductos(num);
    }
    for (var i = 0; i < productosSalida.length; i++) {
        let aux = await categorias.getCategoriaById(productosSalida[i].categoria)
        productosSalida[i].categoria = aux.nombre;
    }
    res.render('./admin/fotos.pug', { id: req.query.id, location: "Fotos de productos", categorias: await categorias.getnombreCategorias(), productos: productosSalida, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, "num": num, "cat": cat })

})

app.post("/productos/insertar", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    try {
        let foto = req.files.foto
        if (!await fs.existsSync(`./static/fotos/${foto.name}`)) {
            await foto.mv(`./static/fotos/${foto.name}`)
            await productos.insertar({ nombre: req.body.nombre, descripcion: req.body.descripcion, precio: req.body.precio, cantidad: req.body.cant, foto: [foto.name], categoria: req.body.categoria })
            res.json({ estado: true })
        } else {
            res.json({ estado: false, error: "Ya existe esa foto" })
        }
    } catch (e) {
        res.json({ estado: false, error: "No se a podido subir la foto" })
    }
})

app.post("/productos/actualizar", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    try {
        await productos.actualizar(req.body._id, { nombre: req.body.nombre, descripcion: req.body.descripcion, precio: req.body.precio, cantidad: req.body.cant, categoria: req.body.categoria })
        res.json({ estado: true })

    } catch (e) {
        console.log(e)
        res.json({ estado: false, error: "No se a podido subir la foto" })
    }
})

app.post("/productos/obtenerUno", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    res.json(await productos.getProductoById(req.body.id))
})

app.post("/productos/borrar", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    var producto = await productos.getProductoById(req.body.id);
    for (var i = 0; i < producto.foto.length; i++) {
        try {
            fs.unlinkSync(`./static/fotos/${producto.foto[i]}`)
        } catch (error) {
            console.log(error)
        }
    }
    res.json(await productos.borrar(req.body.id))
})
app.post("/productos/insertar/foto", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    if (req.body.id) {
        try {
            let foto = req.files.foto
            if (!await fs.existsSync(`./static/fotos/${foto.name}`)) {
                await foto.mv(`./static/fotos/${foto.name}`)
                await productos.insertarFotoById(req.body.id, foto.name)
                res.json({ estado: true })
            } else {
                res.json({ estado: false, error: "Ya existe esa foto" })
            }

        } catch (e) {
            console.log(e)
            res.json({ estado: false, error: "No se podido insertar la foto" })
        }
    } else {
        res.json({ estado: false, error: "No se ha enviado el id del producto" })
    }
})


app.post("/productos/borrar/foto", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    try {
        await productos.borrarFotoProductoById(req.body.id, req.body.foto)
        fs.unlinkSync("./static/fotos/" + req.body.foto);
        res.json({ estado: true })
    } catch (error) {
        console.log(error)
        res.json({ estado: false, error: "No se a podido eliminar la foto" })
    }
})


// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN DEL SITIO-------------------------------------------------------------------------------------------------------------------------------

app.get("/confSitio", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos

    var exec = require('child_process').exec,
        child;
    var os = require("os");
    var arra = []
    if (os.platform() != "win32") {
        child = await exec('ls ' + __dirname + '/../views | grep ""',
            // Pasamos los parámetros error, stdout la salida 
            // que mostrara el comando
            await
            function(error, stdout, stderr) {
                arra = stdout.split("\n")
                arra.pop(); // Elimina la ultima posición del array que está vacia
                arra.splice(arra.indexOf("admin"), 1)
                res.render('./admin/confSitio.pug', { location: "Configuración del Sitio Web", categorias: [], "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, temas: arra, tema: DB_CONF.tema })
            })
    } else {
        child = exec('dir ' + __dirname + '\\..\\views /AD /b',
            await
            function(error, stdout, atderr) {
                var arra = stdout.split("\r\n")
                for (let i = 0; i < arra.length; i++) {
                    arra[i].replace("\n", "")
                }
                arra.pop()
                arra.splice(arra.indexOf("admin"), 1)
                res.render('./admin/confSitio.pug', { location: "Configuración del Sitio Web", categorias: [], "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, temas: arra, tema: DB_CONF.tema })
            })
    }

})

app.post("/confSitio/temas", comprobarpost, async function(req, res) {

    res.json({ estado: false })
})

app.post("/confSitio/descomprimir", comprobarpost, async function(req, res) {
    if (req.files && req.files.temaZip) {
        if (!fs.existsSync(__dirname + `/../views/${req.files.temaZip.name.split(".")[0]}/`)) {
            try {
                await req.files.temaZip.mv(`./views/${req.files.temaZip.name}`)
                var unzipper = require('unzipper')
                fs.createReadStream(__dirname + `/../views/${req.files.temaZip.name}`).pipe(unzipper.Extract({ path: __dirname + `/../views/${req.files.temaZip.name.split('.')[0]}` }));
                if (fs.existsSync(__dirname + `/../views/${req.files.temaZip.name}/js`)) {
                    var antiguo = path.join(__dirname + `/../views/${req.files.temaZip.name}/js`)
                    var nuevo = path.join(__dirname + `/../static/javascript/${req.files.temaZip.split('.')[0]}`)
                    fs.renameSync(antiguo, nuevo)
                }
                fs.unlinkSync(`./views/${req.files.temaZip.name}`)
                res.json({ estado: true })
            } catch (err) {
                console.log(err)
                res.json({ estado: false, error: "No se a podido subir el archivo" })
            }

        } else {
            res.json({ estado: false, error: "Ya existe ese tema" })
        }


    } else {
        res.json({ estado: false, error: "No se han enviado parámetros" })
    }

})

app.post("/confSitio/borrarTema", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json")
    var rimraf = require("rimraf");
    if (req.body) {
        if (fs.existsSync(__dirname + `/../views/${req.body.tema}`)) {
            if (req.body.tema == DB_CONF.tema) {
                DB_CONF.tema = "default"
                await fs.writeFileSync('../CONFIGURE.json', JSON.stringify({
                    "_comentario": "Configuración de la base de datos",

                    "db_user": DB_CONF.db_user,
                    "db_auth": DB_CONF.db_auth,
                    "db_pass": DB_CONF.db_pass,
                    "db_port": DB_CONF.db_port,
                    "db_direccion": DB_CONF.db_direccion,
                    "db_name": DB_CONF.db_name,


                    "_comentario": "Configuración del Sitio Web",

                    "tema": DB_CONF.tema,
                    "direccion": DB_CONF.direccion,
                    "port": DB_CONF.port,
                    "Direccion_Admin": DB_CONF.Direccion_Admin,
                    "https": DB_CONF.https,
                    "SMTP": DB_CONF.SMTP
                }, null, 4));
            }
            rimraf.sync(`./views/${req.body.tema}`)
            if (fs.existsSync(__dirname + `/../static/javascript/${req.body.tema}`)) {
                rimraf.sync(`./static/javascript/${req.body.tema}`)
            }
            res.json({ estado: true })
        } else {
            console.log(__dirname + `/../views/${req.body.tema}`)
            res.json({ estado: false, error: "No existe el tema seleccionado" })
        }

    } else {
        res.json({ estado: false, error: "No se han enviado parámetros" })
    }
})

app.post("/confSitio/guardar", comprobarpost, async function(req, res) {

    var DB_CONF = require("../CONFIGURE.json")
    if (req.body) {
        if (req.body.nombreSitio) {
            DB_CONF.direccion = req.body.nombreSitio;
        }
        if (req.body.portSitio) {
            DB_CONF.port = req.body.portSitio
        }
        if (req.body.tema) {
            DB_CONF.tema = req.body.tema
        }
        if (req.body.nombreAdmin) {

            var exec = require('child_process').exec,
                child;
            var os = require("os");
            var arra = []
            if (os.platform() != "win32") {
                child = exec('ls ./views/' + DB_CONF.tema + ' | grep .pug',
                    // Pasamos los parámetros error, stdout la salida 
                    // que mostrara el comando
                    async function(error, stdout, stderr) {
                        // Imprimimos en pantalla con console.log
                        arra = stdout.split(".pug\n")
                        var esta = false
                        for (let i = 0; i < arra.length; i++) {
                            if (arra[i] == req.body.tema) {
                                esta = true
                            }
                        }
                        if (!esta) {

                        } else {
                            res.json({ estado: false, error: "El tema actual utiliza esa dirección" })
                        }
                        await fs.writeFileSync('./CONFIGURE.json', JSON.stringify(DB_CONF, null, 4));
                        var exec = require('child_process').exec,
                            child;
                        child = await exec('pm2 restart app.js')
                        res.json({ estado: true })
                    })
            } else {
                child = await exec('dir ' + __dirname + '\\..\\views\\' + DB_CONF.tema + '\\*.pug | find ".pug"',
                    // Pasamos los parámetros error, stdout la salida 
                    // que mostrara el comando
                    async function(error, stdout, stderr) {
                        // Imprimimos en pantalla con console.log
                        arra = stdout.match(/\s\w{1,}.pug/gi)
                        for (let i = 0; i < arra.length; i++) {
                            arra[i] = arra[i].split(".")[0].trim()
                        }
                        var esta = false
                        for (let i = 0; i < arra.length; i++) {
                            if (arra[i] == req.body.nombreAdmin) {
                                esta = true
                            }
                        }
                        if (!esta) {
                            DB_CONF.Direccion_Admin = req.body.nombreAdmin
                            await fs.writeFileSync('./CONFIGURE.json', JSON.stringify(DB_CONF, null, 4));
                            var exec = require('child_process').exec,
                                child;
                            child = await exec('pm2 restart app.js')
                            res.json({ estado: true })
                        } else {
                            res.json({ estado: false, error: "El tema actual utiliza esa dirección" })
                        }

                    })
            }
        } else {
            await fs.writeFileSync('./CONFIGURE.json', JSON.stringify(DB_CONF, null, 4));
            var exec = require('child_process').exec,
                child;
            child = await exec('pm2 restart app.js')
            res.json({ estado: true })
        }
    }
})



// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN GENERAL-------------------------------------------------------------------------------------------------------------------------------

app.get("/general", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    res.render('./admin/general.pug', { location: "Configuración General", categorias: [], "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, https: DB_CONF.https, smtp: DB_CONF.SMTP, smtpDatos: { correo: DB_CONF.SMTP_correo, contra: DB_CONF.SMTP_contrasenia } })
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN DEL ADMINISTRADOR-------------------------------------------------------------------------------------------------------------------------------

app.get("/usuarioAdmin", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    res.render('./admin/usuarioAdmin.pug', { location: "Configurar Adminstrador", "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, datosUsu: await usuAdmin.recojerDatos(req.session.admin) })

})

app.post("/usuarioAdmin/contrasenia", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (req.body.contra) {
        if (await usuAdmin.cambiarContra(req.body.contra)) {
            res.json({ estado: true })
        } else {
            res.json({ estado: false, error: "No se ha podido actualizar la contraseña" })
        }
    } else {
        res.json({ estado: false, error: "No se han enviado bien los datos" })
    }
})

app.post("/usuarioAdmin/datos", async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (req.body && req.body.nombreAdmin && req.body.correoAdmin) {
        if (await usuAdmin.cambiarDatos({ nombreAdmin: req.body.nombreAdmin, correoAdmin: req.body.correoAdmin })) {
            req.session.admin = req.body.nombreAdmin
            res.json({ estado: true })
        } else {
            res.json({ estado: false, error: "No se ha podido actualizar la contraseña" })
        }
    } else {
        res.json({ estado: false, error: "No se han enviado bien los datos" })
    }
})
app.post("/usuarioAdmin/cerrar", async function(req, res) {
    req.session.destroy()
    res.json({ estado: true })
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------PEDIDOS-------------------------------------------------------------------------------------------------------------------------------

app.get("/pedidos", comprobarget, async function(req, res) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var pedidos = new Pedidos(url, DB_CONF.db_name);
        var productos = new Producto(url, DB_CONF.db_name)
        var num = parseInt(req.query.num) || 0
        var client = req.query.client || 0
        var id = req.query.id || 0;
        var est = req.query.est || 0
        var pre = req.query.pre || 0
        var estados = ["No pagado", "Pagado", "Confirmado", "En preparación", "Preparado", "Enviado", "Entregado", "Anulado"];
        var precios = ["Mas caros primeros", "Mas baratos primero"]
        if (client != 0) {
            if (num >= await pedidos.getNumeroPedidosByUsu(client)) {
                num -= 5
            }
        } else {
            if (num >= await pedidos.getNumeroPedidos()) {
                num -= 5
            }
        }
        if (num < 0) {
            num = 0
        }
        if (client != 0) {
            var pedido = await pedidos.getPedidosSkipByUsu(num, client)
        } else {
            var pedido = await pedidos.getPedidosSkip(num)
        }
        for (var i = 0; i < pedido.length; i++) {
            var total = 0;
            for (var x = 0; x < pedido[i].contenido.length; x++) {
                var aux = await productos.getProductoById(pedido[i].contenido[x].producto)
                total += (pedido[i].contenido[x].cantidad * aux.precio)
                pedido[i].contenido[x].producto = aux.nombre
                pedido[i].contenido[x].precio = aux.precio
            }
            pedido[i].estado = estados[pedido[i].estado]
            pedido[i].total = total
        }
        res.render('./admin/pedidos.pug', { location: "Pedidos", "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, pedidos: pedido, estados: estados, precios: precios })
    })
    // **************************************************************************************************************************************************
    // **************************************************************************************************************************************************
    //----------Informacio de la empresa-------------------------------------------------------------------------------------------------------------------------------

app.get("/informacionEmpresa", comprobarget, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var general = new General(url, DB_CONF.db_name)
    res.render('./admin/informacionEmpresa.pug', { location: "Información de la Empresa", "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, datos: await general.getInformacionEmpresa() })
})
app.post("/informacionEmpresa", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
})

module.exports = app;