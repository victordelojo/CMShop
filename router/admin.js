var express = require('express');
var app = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var Categoria = require("../controller_db/Categoria")



app.get("/", async function (req, res) {
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.user + ':' + DB_CONF.pass + '@' + DB_CONF.direccionDB + ':' + DB_CONF.portDB + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (req.session.nombre) {
        var categorias = new Categoria(url,DB_CONF.db_name);
        categorias =await categorias.getCategorias()
        var salida=""
        categorias.forEach(function(element,key){
          if(key==categorias.length-1){
            salida+="'"+element+"'"
          }else{
            salida+="'"+element+"',"
          }
          
        })
        var charts=`
          new Chart(document.getElementById('ganancias'), {
            type: 'line',
            data: {
                labels: [`+salida+`],
                datasets: [{
                    data: [0, 100, 300, 250],
                    label: 'Euros',
                    borderColor: '#3e95cd',
                    fill: true
                }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Ganancias en los ultimos días'
                }
            }
        });
        
        new Chart(document.getElementById('pedidos'), {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
                datasets: [{
                    data: [0, 2, 6, 5],
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
              labels: ['Paypal', 'Targeta de Credito', 'GPay', 'otros'],
              datasets: [{
                label: '',
                backgroundColor: ['#3e95cd', '#8e5ea2','#3cba9f','#e8c3b9'],
                data: [2478,5267,734,784]
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
        res.render("./admin/admin.pug",{location:"ESTADISTICAS",charts})
      } else {
        res.redirect("/admin/login");
      }
    }
  } else {
    res.redirect("/");
  }
})
app.get('/login', async function (req, res) {
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.user + ':' + DB_CONF.pass + '@' + DB_CONF.direccionDB + ':' + DB_CONF.portDB + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
    var usuAdmin = new admin(url, DB_CONF.db_name);
    if (await usuAdmin.comprobarInicio()) {
      if (!req.session.nombre) {
        res.render("./admin/adminLogin.pug", { "portDB": DB_CONF.portDB, "hostDB": DB_CONF.direccionDB, "port": DB_CONF.port, "host": DB_CONF.direccion })
      } else {
        res.redirect("/admin");
      }
    }
  } else {
    res.redirect("/");
  }

})

app.post('/login/comprobar', async function (req, res) {
  if (fs.existsSync(__dirname + "/../CONFIGURE.json")) {
    var DB_CONF = require("../CONFIGURE.json")//Carga la configuración de la base de datos
    var url = 'mongodb://' + DB_CONF.user + ':' + DB_CONF.pass + '@' + DB_CONF.direccionDB + ':' + DB_CONF.portDB + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
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


module.exports = app;