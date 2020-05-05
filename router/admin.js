var express = require('express');
var app = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var Categoria = require("../controller_db/Categoria")
var Producto = require("../controller_db/Producto")


app.get("/reiniciar", async function (req, res) { //Cambia los parámetros del archivo de configuración y reinicia el servicio
    var DB_CONF = require("../CONFIGURE.json")
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

app.get("/", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
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
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login");
            }
        }
    } else {
        res.redirect("/");
    }
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------LOGIN-------------------------------------------------------------------------------------------------------------------------------

app.get('/login', async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (!req.session.nombre) {
                res.render("./admin/adminLogin.pug", { "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "");
            }
        }
    } else {
        res.redirect("/");
    }

})

app.post('/login/comprobar', async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarAdmin({ "nombre": req.body.nombre, "pass": req.body.pass })) {
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
app.get('/usuarios', async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                res.render('./admin/usuario.pug', {
                    location: "Usuarios",
                    usuarios: [
                        ["víctor", "123", "qwe"],
                        ["andrea", "123", "qwe"]
                    ],
                    "adminD": DB_CONF.Direccion_Admin
                })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CATEGORIAS-------------------------------------------------------------------------------------------------------------------------------

app.get("/categorias", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var categoriasT = new Categoria(url, DB_CONF.db_name);
                var categoriasTo = await categoriasT.getCategorias();
                res.render('./admin/categorias.pug', { location: "Categorias", categorias: categoriasTo, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})
app.post("/categorias/insertar", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var categorias = new Categoria(url, DB_CONF.db_name);
                var insertar = await categorias.insertar({ nombre: req.body.nombre, ganancias: 0 });
                if (insertar) {
                    res.json({ estado: true });
                } else {
                    res.json({ estado: false, error: "Ya existe esa categoría" });
                }
            } else {
                res.json({ estado: false, error: "No estas logueado como administrador" });
            }
        } else {
            res.json({ estado: false, error: "No existe un usuario administrador" });
        }
    } else {
        res.redirect("confCMShopUser")
    }
})

app.post("/categorias/borrar", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var categorias = new Categoria(url, DB_CONF.db_name);
                var borrar = await categorias.borrar({ nombre: req.body.nombre });
                if (borrar) {
                    res.json({ estado: true });
                } else {
                    res.json({ estado: false, error: "No existe esa categoría" });
                }
            } else {
                res.json({ estado: false, error: "No estas logueado como administrador" });
            }
        } else {
            res.json({ estado: false, error: "No existe un usuario administrador" });
        }
    } else {
        res.redirect("confCMShopUser")
    }
})
app.post("/categorias/editar", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var categorias = new Categoria(url, DB_CONF.db_name);
                var editar = await categorias.editar({ nombreA: req.body.nombreA, nombreN: req.body.nombreN });
                if (editar) {
                    res.json({ estado: true });
                } else {
                    res.json({ estado: false, error: "Ya existe esa categoría" });
                }
            } else {
                res.json({ estado: false, error: "No estas logueado como administrador" });
            }
        } else {
            res.json({ estado: false, error: "No existe un usuario administrador" });
        }
    } else {
        res.redirect("confCMShopUser")
    }
})


// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------PRODUCTOS-------------------------------------------------------------------------------------------------------------------------------


app.get("/productos", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var categorias = new Categoria(url, DB_CONF.db_name);
                var productos = new Producto(url, DB_CONF.db_name);
                var productosSalida = await productos.getProductos();
                for(var i=0;i<productosSalida.length;i++){
                    let aux=await categorias.getCategoriaById(productosSalida[i].categoria)
                    productosSalida[i].categoria=aux.nombre; 
                }
                res.render('./admin/productos.pug', { location: "Productos", categorias: await categorias.getnombreCategorias(), productos: productosSalida, "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD": DB_CONF.Direccion_Admin })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})

app.post("/productos/insertar", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var productos = new Producto(url, DB_CONF.db_name);
                try {
                    let foto = req.files.foto
                    await foto.mv(`./static/fotos/${foto.name}`)
                    await productos.insertar({ nombre: req.body.nombre, descripcion: req.body.descripcion, precio: req.body.precio, cantidad: req.body.cant, foto: foto.name, categoria: req.body.categoria })
                    res.json({ estado: true })
                } catch (e) {
                    res.json({ estado: false, error: "No se a podido subir la foto" })
                }

            } else {
                res.json({ estado: false, error: "No eres administrador" })
            }
        } else {
            res.json({ estado: false, error: "No hay usuario administrador" })
        }
    } else {
        res.json({ estado: false, error: "CMShop no está configurado" })
    }
})

app.post("/productos/actualizar", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var productos = new Producto(url, DB_CONF.db_name);
                try {
                    if ((req.files && req.files.foto)) {
                        if (await productos.getProductosFotosCount(req.body.antiguaFoto) == 1) {
                            try {
                                fs.unlinkSync(`./static/fotos/${req.body.antiguaFoto}`)
                            } catch (error) {
                                
                            }
                        }
                        let foto = req.files.foto;
                        await foto.mv(`./static/fotos/${foto.name}`)
                        await productos.actualizar(req.body._id, { nombre: req.body.nombre, descripcion: req.body.descripcion, precio: req.body.precio, cantidad: req.body.cant, foto: foto.name, categoria: req.body.categoria })
                    } else {
                        console.log(req.body)
                        await productos.actualizar(req.body._id, { nombre: req.body.nombre, descripcion: req.body.descripcion, precio: req.body.precio, cantidad: req.body.cant, categoria: req.body.categoria })

                    }
                    res.json({ estado: true })

                } catch (e) {
                    console.log(e)
                    res.json({ estado: false, error: "No se a podido subir la foto" })
                }

            } else {
                res.json({ estado: false, error: "No eres administrador" })
            }
        } else {
            res.json({ estado: false, error: "No hay usuario administrador" })
        }
    } else {
        res.json({ estado: false, error: "CMShop no está configurado" })
    }
})

app.post("/productos/obtenerUno", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var productos = new Producto(url, DB_CONF.db_name);
                res.json(await productos.getProductoById(req.body.id))
            } else {
                res.json({ estado: false, error: "No eres administrador" })
            }
        } else {
            res.json({ estado: false, error: "No hay usuario administrador" })
        }
    } else {
        res.json({ estado: false, error: "CMShop no está configurado" })
    }
})

app.post("/productos/borrar",async function(req,res){
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                var productos = new Producto(url, DB_CONF.db_name);
                var producto=await productos.getProductoById(req.body.id)
                if (await productos.getProductosFotosCount(producto.foto) == 1) {
                    try {
                        fs.unlinkSync(`./static/fotos/${producto.foto}`)
                    } catch (error) {
                        
                    }
                }
                res.json(await productos.borrar(req.body.id))
            } else {
                res.json({ estado: false, error: "No eres administrador" })
            }
        } else {
            res.json({ estado: false, error: "No hay usuario administrador" })
        }
    } else {
        res.json({ estado: false, error: "CMShop no está configurado" })
    }
})


// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN DEL SITIO-------------------------------------------------------------------------------------------------------------------------------

app.get("/confSitio", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                res.render('./admin/confSitio.pug', { location: "Configuración del Sitio Web", categorias: [], "adminD": DB_CONF.Direccion_Admin })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})


// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN GENERAL-------------------------------------------------------------------------------------------------------------------------------

app.get("/general", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                res.render('./admin/general.pug', { location: "Configuración General", categorias: [], "adminD": DB_CONF.Direccion_Admin })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------CONFIGURACIÓN DEL ADMINISTRADOR-------------------------------------------------------------------------------------------------------------------------------

app.get("/usuarioAdmin", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                res.render('./admin/usuarioAdmin.pug', { location: "Configurar Adminstrador", "adminD": DB_CONF.Direccion_Admin, datosUsu: await usuAdmin.recojerDatos(req.session.nombre) })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})

// **************************************************************************************************************************************************
// **************************************************************************************************************************************************
//----------PEDIDOS-------------------------------------------------------------------------------------------------------------------------------

app.get("/pedidos", async function (req, res) {
    if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                res.render('./admin/pedidos.pug', { location: "Pedidos", "adminD": DB_CONF.Direccion_Admin })
            } else {
                res.redirect("/" + DB_CONF.Direccion_Admin + "/login")
            }
        } else {
            res.redirect("/")
        }
    } else {
        res.redirect("confCMShopUser")
    }
})


module.exports = app;