var express = require('express');
var app = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var Categoria = require("../controller_db/Categoria")
var Producto = require("../controller_db/Producto")


app.get("/reiniciar", async function (req, res){ //Cambia los parámetros del archivo de configuración y reinicia el servicio
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
  var exec = require('child_process').exec, child;
  child = exec('pm2 restart app.js')
  res.redirect("http://martin27.ddns.net:"+3000+"/"+DB_CONF.Direccion_Admin)
})

app.get("/", async function (req, res) {
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        var categorias = new Categoria(url,DB_CONF.db_name);
        var productos = new Producto(url,DB_CONF.db_name)
        var ganancaiasCategorias=await categorias.getPedidosPrecioDeCategorias();
        var pedidosMensuales= await productos.totalProductosMensuales();
        var gananciasMesnuales = await productos.getGananciasMensuales();
        var meses=["'Enero'","'Febrero'","'Marzo'","'Abril'","'Mayo'","'Junio'","'Julio'","'Agosto'","'Septiembre'","'Octubre'","'Noviembre'","'Diciembre'"];
        var mes=new Date().getMonth();
        var aux=[]
        for(i=3;i>=0;i--){
          aux[i]=meses[mes]
          if(mes==0){
            mes=11;
          }else{
            mes--;
          }
        }
        var charts=`
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
        res.render("./admin/admin.pug",{location:"ESTADISTICAS",charts,"adminD":DB_CONF.Direccion_Admin})
      } else {
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login");
      }
    }
  } else {
    res.redirect("/");
  }
})
app.get('/login', async function (req, res) {
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (!req.session.nombre) {
        res.render("./admin/adminLogin.pug", { "port": DB_CONF.port, "host": DB_CONF.direccion, "adminD":DB_CONF.Direccion_Admin })
      } else {
        res.redirect("/"+DB_CONF.Direccion_Admin+"");
      }
    }
  } else {
    res.redirect("/");
  }

})

app.post('/login/comprobar', async function (req, res) {
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarAdmin({ "nombre": req.body.nombre, "pass": req.body.pass })) {
      req.session.nombre = req.body.nombre;
      res.json({ estado: true });
    }else{
      res.json({ estado: false });
    }
  } else {
    res.json({ estado: false });
  }
})
app.get('/usuarios', async function (req,res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/usuario.pug',{location:"Usuarios",usuarios:[["víctor","123","qwe"],["andrea","123","qwe"]],"adminD":DB_CONF.Direccion_Admin})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})

app.get("/categorias", async function (req,res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/categorias.pug',{location:"Categorias",categorias:["Electronica","hogar"],"adminD":DB_CONF.Direccion_Admin})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})

app.get("/productos", async function (req,res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/productos.pug',{location:"Productos",categorias:[],"adminD":DB_CONF.Direccion_Admin})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})
app.get("/confSitio", async function (req,res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/confSitio.pug',{location:"Configuración del Sitio Web",categorias:[],"adminD":DB_CONF.Direccion_Admin})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})
app.get("/general", async function (req,res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/general.pug',{location:"Configuración General",categorias:[],"adminD":DB_CONF.Direccion_Admin})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})
app.get("/usuarioAdmin",async function (req,res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/usuarioAdmin.pug',{location:"Configurar Adminstrador","adminD":DB_CONF.Direccion_Admin,datosUsu: await usuAdmin.recojerDatos(req.session.nombre)})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})
app.get("/pedidos",async function (req, res){
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        res.render('./admin/pedidos.pug',{location:"Pedidos","adminD":DB_CONF.Direccion_Admin})
      }else{
        res.redirect("/"+DB_CONF.Direccion_Admin+"/login")
      }
    }else{
      res.redirect("/")
    }
  }else{
    res.redirect("confCMShopUser")
  }
})

module.exports = app;