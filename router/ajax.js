var express = require("express")
var router = express.Router()
var fs = require("fs")
var cookie = require("cookie-parser")
var Pedidos = require("../controller_db/Pedidos")
var Categorias = require("../controller_db/Categoria")
var Productos = require("../controller_db/Producto");
var Usuario = require("../controller_db/Usuario")
var admin = require("../controller_db/Admin.js")
var General = require("../controller_db/General.js")



var comprobarpost = async function(req, res, next) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            return next();
        } else {
            res.json({ estado: false, error: "Problemas con el servidor CMShop" });
        }
    } else {
        res.json({ estado: false, error: "Problemas con el servidor CMShop" })
    }
}
router.post("/productos", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var productos = new Productos(url, DB_CONF.db_name);
    res.json(await productos.getProductosAjax());
})
router.post("/categorias", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var categorias = new Categorias(url, DB_CONF.db_name);
    res.json(await categorias.getCategorias());
})
router.post("/pedidos", comprobarpost, async function(req, res) {
    if (req.session.usuario) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var pedidos = new Pedidos(url, DB_CONF.db_name);
        var salida = await pedidos.getPedidosByCorreo(req.session.usuario)
        var productos = new Productos(url, DB_CONF.db_name)
        for (let i = 0; i < salida.length; i++) {
            for (let x = 0; x < salida[i].contenido.length; x++) {
                var aux = await productos.getProductoById(salida[i].contenido[x].producto);
                salida[i].contenido[x].producto = aux.nombre
                salida[i].contenido[x].precio = aux.precio
            }
        }
        res.json({ estado: true, pedidos: salida });
    } else {
        res.json({ estado: false, error: "No estas logeado" });
    }
})
router.post("/usuario", comprobarpost, async function(req, res) {
    if (req.session.usuario) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuario = new Usuario(url, DB_CONF.db_name);
        var aux = await usuario.getUsuarioByCorreo(req.session.usuario)
        aux.estado = true;
        res.json(aux);
    } else {
        res.json({ estado: false, error: "No estas logeado" });

    }
})
router.post("/comprar", comprobarpost, async function(req, res) {
    if (req.session.usuario) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuario = new Usuario(url, DB_CONF.db_name)
        if (req.body) {
            req.body.correo = req.session.usuario
            if (await usuario.pedidoNuevo(req.body)) {
                res.json({ estado: true })
            } else {
                res.json({ estado: false, error: "No se a podido crear el pedido" });
            }
        } else {
            res.json({ estado: false, error: "No se ha enviado los datos correctamente" });
        }
    } else {
        res.json({ estado: false, error: "No estas logeado" });
    }
})

router.post("/informacionEmpresa", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var general = new General(url, DB_CONF.db_name);
    res.json(await general.getInformacionEmpresa())
})

router.post("/usuario/inicio", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuario = new Usuario(url, DB_CONF.db_name);
    if (await usuario.isUsuarioByCorreo(req.body.correo, req.body.contra)) {
        req.session.usuario = req.body.correo;
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "Correo o contraseña incorrectos" });
    }
})

router.post("/usuario/nuevo", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuario = new Usuario(url, DB_CONF.db_name);
    if (await usuario.insertar({ nombre: req.body.nombre, correo: req.body.correo, contra: req.body.contra })) {
        req.session.usuario = req.body.correo;
        res.json({ estado: true });
    } else {
        res.json({ estado: false, error: "Ya existe un usuario con ese correo" });
    }
})

router.post("/cerrarSesion", async function(req, res) {
    req.session.destroy();
    res.json({ estado: true })
})

router.post("/cesta/agregar", comprobarpost, async function(req, res) {
    //res.clearCookie("cesta")
    if (req.body && req.body.id && req.body.cantidad) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var producto = new Productos(url, DB_CONF.db_name)
        var aux = await producto.getProductoById(req.body.id)
        if (req.body.cantidad < aux.cantidad) {

        }
        if (!req.cookies) {
            res.cookie("cesta", { productos: [{ id: req.body.id, cantidad: req.body.cantidad }] }, { maxAge: 1000 * 60 * 60 * 24 * 7 })
        } else {
            req.cookies.cesta.productos.push({ id: req.body.id, cantidad: req.body.cantidad })
        }
        res.json({ estado: true })
    } else {
        res.json({ estado: false, error: "No se han enviado bien los datos" })
    }
})
router.post("/cesta", async function(req, res) {
    res.json(req.cookies.productos)
})

module.exports = router