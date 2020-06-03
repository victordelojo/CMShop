var express = require('express');
var router = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var os = require("os");




// Vamos a requerir del modulo que provee Node.js 
// llamado child_process
var exec = require('child_process').exec,
    child;

if (os.platform() != "win32" && fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    child = exec('ls ./views/' + DB_CONF.tema + ' | grep .pug',
        // Pasamos los parámetros error, stdout la salida 
        // que mostrara el comando
        function(error, stdout, stderr) {
            // Imprimimos en pantalla con console.log
            var arra = stdout.split(".pug\n")
            arra.forEach(element => {
                if (element !== "") {
                    if (element == "index") {
                        element = ""
                    }
                    router.get("/" + element, async function(req, res) {
                        if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {

                            var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
                            var usuAdmin = new admin(url, DB_CONF.db_name);
                            if (await usuAdmin.comprobarInicio().catch(function() { return false })) {
                                if (element == "") {
                                    element = "index"
                                }
                                if (req.session.usuario) {
                                    req.query.sesion = true
                                } else {
                                    req.query.sesion = false
                                }
                                console.log("sldjvb")
                                if (res.cookies.cesta) {
                                    req.query.cesta = res.cookies.cesta.productos.length
                                    console.log("sldjvb")
                                } else {
                                    req.query.cesta = 0
                                    console.log("sldjvb")
                                }
                                if (req.query) {
                                    res.render("./" + DB_CONF.tema + "/" + element + ".pug", req.query);
                                } else {
                                    res.render("./" + DB_CONF.tema + "/" + element + ".pug");
                                }
                                // Envia el archivo que se va a visualizar
                            } else {
                                res.render("./admin/configurar_CMShop.pug")
                            }
                        } else {
                            res.render("./admin/configurar_CMShop.pug")
                        }
                    });
                }

            });
            // controlamos el error
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
} else {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json")
        child = exec('dir ' + __dirname + '\\..\\views\\' + DB_CONF.tema + '\\*.pug | find ".pug"',
            // Pasamos los parámetros error, stdout la salida 
            // que mostrara el comando
            function(error, stdout, stderr) {
                // Imprimimos en pantalla con console.log
                var arra = stdout.match(/\s\w{1,}.pug/gi)
                try {
                    arra.forEach(element => {
                        if (element !== "") {
                            if (element.trim() == "index.pug") {
                                element = ""
                            }
                            router.get("/" + element.split(".")[0].trim(), async function(req, res) {
                                if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
                                    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
                                    var usuAdmin = new admin(url, DB_CONF.db_name);
                                    if (await usuAdmin.comprobarInicio().catch(function() { return false })) {
                                        if (element == "") {
                                            element = "index"
                                        }
                                        if (req.session.usuario) {
                                            req.query.sesion = true
                                        } else {
                                            req.query.sesion = false
                                        }
                                        if (req.cookies.cesta) {
                                            req.query.cesta = req.cookies.cesta.productos.length
                                        } else {
                                            req.query.cesta = 0
                                        }
                                        if (req.query) {
                                            res.render("./" + DB_CONF.tema + "/" + element.trim(), req.query);
                                        } else {
                                            res.render("./" + DB_CONF.tema + "/" + element.trim()); // Envia el archivo que se va a visualizar
                                        }
                                    } else {
                                        res.render("./admin/configurar_CMShop.pug")
                                    }
                                } else {
                                    res.render("./admin/configurar_CMShop.pug")
                                }
                            });
                        }

                    });
                } catch (error) {
                    router.get("/", function(req, res) {
                        res.render("./default/NoTema.pug");
                    })
                }

                // controlamos el error
                if (error !== null) {
                    console.log("Error del tema");
                    router.get("/", function(req, res) {
                        res.render("./default/NoTema.pug");
                    })
                }
            });
    } else {
        router.get("/", function(req, res) {
            res.render("./admin/configurar_CMShop.pug")
        })
    }

}



module.exports = router;