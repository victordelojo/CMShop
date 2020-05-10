var express = require('express');
var app = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var Categoria = require("../controller_db/Categoria")
var Producto = require("../controller_db/Producto")
var Usuario = require("../controller_db/Usuario")
var Pedidos = require("../controller_db/Pedidos")

var comprobarpost = async function (req, res, next) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
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

var comprobarget = async function (req, res, next) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                return next();
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login");
            }
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect("/confCMShopUser");
    }
}


app.get("/reiniciar", async function (req, res) { //Cambia los parámetros del archivo de configuración y reinicia el servicio
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

app.get("/", comprobarget, async function (req, res) {
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

app.get('/login', async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    res.render("./admin/adminLogin.pug", { "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })
})

app.post('/login/comprobar', async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarAdmin({ "nombreAdmin": req.body.nombre, "contraAdmin": req.body.pass })) {
            req.session.nombre = req.body.nombre;
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
app.get('/usuarios', comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name); var usuarios = new Usuario(url, DB_CONF.db_name)
    var num = parseInt(req.query.num) || 0
    var nombre = req.query.nombre || 0
    if (nombre != 0) {
        if (num >= await usuarios.getNumTotalUsuariosByNombre(nombre)) {
            num -= 5
        } else if (num < 0) {
            num = 0
        }
        var usuario = await usuarios.getUsuariosByNombre(num, nombre);
    } else {
        if (num >= await usuarios.getNumTotalUsuarios()) {
            num -= 5
        } else if (num < 0) {
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
        "port": DB_CONF.port, "host": DB_CONF.direccion,
        "num": num,
        "nombre": nombre
    })
})

app.post("/usuarios/insertar", comprobarpost, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuario = new Usuario(url, DB_CONF.db_name);
    if (await usuario.insertar(req.body)) {
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "Ya existe un usuario con ese correo" });
    }
})

app.post("/usuarios/borrar", comprobarpost, async function (req, res) {
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

app.get("/categorias", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name); var categoriasT = new Categoria(url, DB_CONF.db_name);
    var categoriasTo = await categoriasT.getCategorias();
    res.render('./admin/categorias.pug', { location: "Categorias", categorias: categoriasTo, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })

})
app.post("/categorias/insertar", comprobarpost, async function (req, res) {
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

app.post("/categorias/borrar", async function (req, res) {
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
app.post("/categorias/editar", async function (req, res) {
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


app.get("/productos", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    var num = parseInt(req.query.num) || 0
    var cat = req.query.cat || 0
    var categorias = new Categoria(url, DB_CONF.db_name)
    if (cat != 0) {
        if (num >= await productos.getNumTotalProductosByCategoria(cat)) {
            num -= 4
        } else if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductosByCategoria(num, cat);
    } else {
        if (num >= await productos.getNumTotalProductos()) {
            num -= 4
        } else if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductos(num);
    }
    for (var i = 0; i < productosSalida.length; i++) {
        let aux = await categorias.getCategoriaById(productosSalida[i].categoria)
        productosSalida[i].categoria = aux.nombre;
    }
    res.render('./admin/productos.pug', { location: "Productos", categorias: await categorias.getnombreCategorias(), productos: productosSalida, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, "num": num, "cat": cat })

})

app.get("/fotos", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    var categorias = new Categoria(url, DB_CONF.db_name)
    var num = parseInt(req.query.num) || 0
    var cat = req.query.cat || 0
    if (cat != 0) {
        if (num >= await productos.getNumTotalProductosByCategoria(cat)) {
            num -= 4
        } else if (num < 0) {
            num = 0
        }
        var productosSalida = await productos.getProductosByCategoria(num, cat);
    } else {
        if (num >= await productos.getNumTotalProductos()) {
            num -= 4
        } else if (num < 0) {
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

app.post("/productos/insertar", async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    try {
        let foto = req.files.foto
        if (! await fs.existsSync(`./static/fotos/${foto.name}`)) {
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

app.post("/productos/actualizar", async function (req, res) {
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

app.post("/productos/obtenerUno", async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    res.json(await productos.getProductoById(req.body.id))
})

app.post("/productos/borrar", async function (req, res) {
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
app.post("/productos/insertar/foto", async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Producto(url, DB_CONF.db_name);
    if (req.body.id) {
        try {
            let foto = req.files.foto
            if (! await fs.existsSync(`./static/fotos/${foto.name}`)) {
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


app.post("/productos/borrar/foto", async function (req, res) {
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

app.get("/confSitio", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    res.render('./admin/confSitio.pug', { location: "Configuración del Sitio Web", categorias: [], "adminD": DB_CONF.Direccion_Admin })

})


// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN GENERAL-------------------------------------------------------------------------------------------------------------------------------

app.get("/general", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    res.render('./admin/general.pug', { location: "Configuración General", categorias: [], "adminD": DB_CONF.Direccion_Admin })
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN DEL ADMINISTRADOR-------------------------------------------------------------------------------------------------------------------------------

app.get("/usuarioAdmin", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    res.render('./admin/usuarioAdmin.pug', { location: "Configurar Adminstrador", "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, datosUsu: await usuAdmin.recojerDatos(req.session.nombre) })

})

app.post("/usuarioAdmin/contrasenia", async function (req, res) {
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

app.post("/usuarioAdmin/datos", async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (req.body && req.body.nombreAdmin && req.body.correoAdmin) {
        if (await usuAdmin.cambiarDatos(req.body)) {
            req.session.nombre = req.body.nombreAdmin
            res.json({ estado: true })
        } else {
            res.json({ estado: false, error: "No se ha podido actualizar la contraseña" })
        }
    } else {
        res.json({ estado: false, error: "No se han enviado bien los datos" })
    }
})
app.post("/usuarioAdmin/cerrar", async function (req, res) {
    req.session.destroy()
    res.json({ estado: true })
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------PEDIDOS-------------------------------------------------------------------------------------------------------------------------------

app.get("/pedidos", comprobarget, async function (req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var pedidos = new Pedidos(url, DB_CONF.db_name);
    var productos= new Producto(url,DB_CONF.db_name)
    var num = parseInt(req.query.num) || 0
    if (num >= await pedidos.getNumeroPedidos()) {
        num -= 5
    } else if (num < 0) {
        num = 0
    }
    var pedido = await pedidos.getPedidosSkip(num)
    for(var i=0;i<pedido.length;i++){
        var total=0;
        for(var x=0;x<pedido[i].contenido.length;x++){
            var aux=await productos.getProductoById(pedido[i].contenido[x].producto)
            total+=(pedido[i].contenido[x].cantidad*aux.precio)
            pedido[i].contenido[x].producto=aux.nombre
            pedido[i].contenido[x].precio=aux.precio
        }
        pedido[i].total=total
    }
    console.log(pedido[0].contenido[0])
    res.render('./admin/pedidos.pug', { location: "Pedidos", "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin, pedidos: pedido })
})


module.exports = app;