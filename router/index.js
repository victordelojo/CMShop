var express = require('express');
var router = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")





/* GET home page. */
router.get('/', async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.user + ':' + DB_CONF.pass + '@' + DB_CONF.direccionDB + ':' + DB_CONF.portDB + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio().catch(function () { return false })) {
            res.render("./default/index.pug");// Envia el archivo que se va a visualizar
        } else {
            res.render("./admin/configurar_CMShop.pug")
        }
    } else {
        res.render("./admin/configurar_CMShop.pug")
    }
});

router.get("/pagar", async function (req, res) {

    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.user + ':' + DB_CONF.pass + '@' + DB_CONF.direccionDB + ':' + DB_CONF.portDB + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
        res.render("./default/pagar.pug")
    } else {
        res.render("./admin/configurar_CMShop.pug")
    }
});

module.exports = router;