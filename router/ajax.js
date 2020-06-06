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
                salida[i].contenido[x].idProducto = aux._id
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
        if (req.cookies && req.cookies.cesta && req.cookies.cesta.productos) {
            var productos = req.cookies.cesta
            productos.correo = req.session.usuario
            var id = await usuario.pedidoNuevo(productos)
            if (id != false) {
                req.cookies.cesta.productos = []
                req.cookies.cesta.total = 0
                res.cookie("cesta", req.cookies.cesta).json({ estado: true, id: id })
            } else {
                res.json({ estado: false, error: "No se a podido crear el pedido" });
            }
        } else {
            res.json({ estado: false, error: "No hay pedidos en la cesta" });
        }
    } else {
        res.json({ estado: false, error: "No estas logeado" });
    }
})

router.post("/anular/pedido", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var pedido = new Pedidos(url, DB_CONF.db_name);
    if (req.session.usuario) {
        if (req.body && req.body.id) {
            if (await pedido.borrarPedidoById(req.body.id)) {
                res.json({ estado: true })
            } else {
                res.json({ estado: false, error: "No se a podido anular el pedido" })
            }
        } else {
            res.json({ estado: false, error: "No se han enviado los parámetros correctamente" })
        }
    } else {
        res.json({ estado: false, error: "No se ha iniciado sesion" })
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

router.post("/usuario/actualizar/datos", comprobarpost, async function(req, res) {
    if (req.session && req.session.usuario) {
        if (req.body) {
            var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
            var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
            var usuario = new Usuario(url, DB_CONF.db_name);
            if (req.body.nombre && req.body.correo && (req.body.direccion !== "" || req.body.direccion === "")) {
                if (await usuario.update(req.session.usuario, { nombre: req.body.nombre, correo: req.body.correo, direccion: req.body.direccion })) {
                    req.session.usuario = req.body.correo;
                    res.json({ estado: true });
                } else {
                    res.json({ estado: false, error: "No se ha podido actualizar el usuario" });
                }
            } else if (req.body.contra) {
                if (await usuario.update(req.session.usuario, { contra: req.body.contra })) {
                    res.json({ estado: true });
                } else {
                    res.json({ estado: false, error: "No se ha podido actualizar el usuario" });
                }
            } else {
                res.json({ estado: false, error: "No se han enviado los parámetros correctamente" })
                console.log(req.body)
            }
        } else {
            res.json({ estado: false, error: "No se han enviado parámetros" })
        }
    } else {
        res.json({ estado: false, error: "No has iniciado sesión" })
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
        if (!req.cookies || !req.cookies.cesta) {
            if (req.body.cantidad <= aux.cantidad) {
                res.cookie("cesta", { total: aux.precio * parseInt(req.body.cantidad), productos: [{ id: req.body.id, cantidad: parseInt(req.body.cantidad) }] }, { maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ estado: true })
            } else {
                res.json({ estado: false, error: "No hay suficiente stock" })
            }
        } else {
            var esta = false;
            for (let i = 0; i < req.cookies.cesta.productos.length; i++) {
                if (req.cookies.cesta.productos[i].id == req.body.id) {
                    esta = true
                    if (parseInt(req.cookies.cesta.productos[i].cantidad) + parseInt(req.body.cantidad) <= aux.cantidad) {
                        req.cookies.cesta.productos[i].cantidad = (parseInt(req.body.cantidad) + parseInt(req.cookies.cesta.productos[i].cantidad)) + "";
                        req.cookies.cesta.total = parseFloat(req.cookies.cesta.total) + (aux.precio * parseInt(req.body.cantidad))
                        req.cookies.cesta.total = Math.round(req.cookies.cesta.total * 100) / 100
                        res.cookie("cesta", req.cookies.cesta, { maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ estado: true })
                    } else {
                        res.json({ estado: false, error: "No hay suficiente stock" })
                    }
                }
            }
            if (!esta) {
                if (parseInt(req.body.cantidad) <= aux.cantidad) {
                    req.cookies.cesta.productos.push({ id: req.body.id, cantidad: req.body.cantidad })
                    req.cookies.cesta.total = parseFloat(req.cookies.cesta.total) + (aux.precio * parseInt(req.body.cantidad))
                    req.cookies.cesta.total = Math.round(req.cookies.cesta.total * 100) / 100
                    res.cookie("cesta", req.cookies.cesta, { maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ estado: true })
                } else {
                    res.json({ estado: false, error: "No hay suficiente stock" })
                }
            }
        }

    } else {
        res.json({ estado: false, error: "No se han enviado bien los datos" })
    }
})

router.post("/cesta/borrar", comprobarpost, async function(req, res) {
    if (req.cookies && req.cookies.cesta) {
        if (req.body && req.body.id) {
            var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
            var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
            var producto = new Productos(url, DB_CONF.db_name)
            var aux = await producto.getProductoById(req.body.id)
            var salida = []
            for (let i = 0; i < req.cookies.cesta.productos.length; i++) {
                if (req.cookies.cesta.productos[i].id != req.body.id) {
                    salida.push(req.cookies.cesta.productos[i])
                } else {
                    req.cookies.cesta.total = parseFloat(req.cookies.cesta.total) - (aux.precio * parseInt(req.cookies.cesta.productos[i].cantidad))
                    req.cookies.cesta.total = Math.round(req.cookies.cesta.total * 100) / 100
                }
            }
            req.cookies.cesta.productos = salida
            res.cookie("cesta", req.cookies.cesta, { maxAge: 1000 * 60 * 60 * 24 * 7 }).json({ estado: true })
        } else {
            res.json({ estado: false, error: "No se han enviado los parámetros" })
        }
    } else {
        res.json({ estado: false, error: "No hay ningun producto en la cesta" })
    }

})

router.post("/cesta", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json")
    var salida = []
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var producto = new Productos(url, DB_CONF.db_name)
    if (req.cookies.cesta) {
        for (let i = 0; i < req.cookies.cesta.productos.length; i++) {
            var aux = await producto.getProductoById(req.cookies.cesta.productos[i].id)
            salida.push({ producto: aux, cantidad: req.cookies.cesta.productos[i].cantidad })
        }
        res.json({ cesta: salida, total: req.cookies.cesta.total })
    } else {
        res.json({ cesta: [], total: 0 })
    }

})

router.get("/pagar", comprobarpost, async function(req, res) {
    var DB_CONF = require("../CONFIGURE.json")
    if (DB_CONF.paypalEmail) {
        if (req.session.usuario) {
            if (req.cookies.cesta.productos) {
                var salida = []
                var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
                var producto = new Productos(url, DB_CONF.db_name)
                for (let i = 0; i < req.cookies.cesta.productos.length; i++) {
                    var aux = await producto.getProductoById(req.cookies.cesta.productos[i].id)
                    if (aux.cantidad < parseInt(req.cookies.cesta.productos[i].cantidad)) {
                        res.redirect(req.headers.referer + "?error=El producto '" + aux.nombre + "' no hay suficiente stock")
                    }
                    salida.push({ producto: aux, cantidad: req.cookies.cesta.productos[i].cantidad })
                }
                res.render("./default/pagar.pug", { cesta: salida, datos: DB_CONF })
            } else {
                res.redirect(req.headers.referer + "?error=No hay productos en la cesta")
            }
        } else {
            res.redirect(req.headers.referer + "?session=off")
                //res.json({ estado: false, error: "No se ha iniciado sesión" })
        }
    } else {
        res.redirect(req.headers.referer + "?paypa=La opcion de pago no está configurada")
    }

})

module.exports = router