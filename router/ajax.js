var express = require("express")
var router = express.Router()
var fs = require("fs")
var Pedidos = require("../controller_db/Pedidos")
var Categorias = require("../controller_db/Categoria")
var Productos = require("../controller_db/Producto");
var Usuario = require("../controller_db/Usuario")
var admin = require("../controller_db/Admin.js")



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
    res.json(await productos.getProductos());
})
router.post("/categorias", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var categorias = new Categorias(url, DB_CONF.db_name);
    res.json(await categorias.getCategorias());
})
router.post("/pedidos", comprobarpost, async function(req, res) {
    if (req.session.nombre) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var pedidos = new Pedidos(url, DB_CONF.db_name);
        res.json(await pedidos.getPedidosByUsu(req.session.nombre));

    } else {
        res.json({ estado: false, error: "No estas logeado" });
    }
})
router.post("/usuario", comprobarpost, async function(req, res) {
    if (req.session.nombre) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuario = new Usuario(url, DB_CONF.db_name);
        res.json(await usuario.getUsuarioById(req.session.nombre));
    } else {
        res.json({ estado: false, error: "No estas logeado" });
    }
})

module.exports = router