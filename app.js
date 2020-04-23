var express = require('express');
var app = express();
var body_parser = require('body-parser');// Poder parsear los datos para los métodos POST
var useAdmin = require("./controller_db/Admin.js")
var fs = require('fs');
var DB_CONF = "";
var adminD="admin";
try {
  fs.accessSync('./CONFIGURE.json');
  DB_CONF = require("./CONFIGURE.json")//Carga la configuración
  adminD=DB_CONF.Direccion_Admin;
}
catch (err) {
  console.log("no esta")
}
const session = require('express-session');// Para poder manejar sesiones
var nodemailer = require('nodemailer');// Para enviar correos
var favicon = require('serve-favicon');



// Rutas 

var inicio = require("./router/index");
var admin = require("./router/admin");


app.use(favicon(__dirname + '/static/logo.png'));// 
app.use(express.static("static")) // Añade la carpeta con los archivos estaticos de la aplicación
app.use(body_parser.urlencoded({ extended: true }));// Usa el parseo para el metodo POST
app.set("view engine", "pug")// Indicamos el motor de plantilla que utilizaremos  

app.use(session({ secret: 'AltoSecreto', resave: false, saveUninitialized: true }));//Usa sieiones con una frase secreta




// Connection URL


/*
ROUTING
**************************************************************************************************************
*/

app.use("/", inicio);



app.use("/"+adminD, admin)

app.post("/confCMShopUser", async function (req, res) {
  var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
  var userAdmin = new useAdmin(url, req.body.nombreDB);
  if (!await userAdmin.comprobarInicio()) {
    var nombre = req.body.nombre || ''; // Recoge el parámetro nombre y si no existe lo pone en blanco
    if (nombre != "") {
      var email = req.body.email;
      var pass = req.body.pass;

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'cmshoproyecto@gmail.com',
          pass: '123qweASD?'
        }
      });

      var mailOptions = {
        from: 'cmshoproyecto@gmail.com',
        to: email,
        subject: 'Bienvenido a CMShop',
        html: '<h1>Muchas gracias de utilizar CMShop</h1><br>\
          '
      };
      await transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
        } else {
          escribir = {
            "_comentario": "Configuración de la base de datos",

            "db_user": req.body.usuarioDB,
            "db_auth": req.body.accesoDB,
            "db_pass": req.body.passDB,
            "db_port": req.body.portDB,
            "db_direccion": req.body.direccionDB,
            "db_name": req.body.nombreDB,


            "_comentario": "Configuración del Sitio Web",

            "direccion": req.body.nombreHost,
            "port": req.body.portHost,
            "Direccion_Admin": req.body.direcAdmin
          }
          console.log('Email sent: ' + info.response);
          DB_CONF = escribir;
        }
      });
      await fs.writeFileSync('./CONFIGURE.json', JSON.stringify({
        "_comentario": "Configuración de la base de datos",

        "db_user": req.body.usuarioDB,
        "db_auth": req.body.accesoDB,
        "db_pass": req.body.passDB,
        "db_port": req.body.portDB,
        "db_direccion": req.body.direccionDB,
        "db_name": req.body.nombreDB,


        "_comentario": "Configuración del Sitio Web",

        "direccion": req.body.nombreHost,
        "port": req.body.portHost,
        "Direccion_Admin": req.body.direcAdmin
      }, null, 4));
      userAdmin.insertar({ "nombre": nombre, "email": email, "pass": pass })

    }
  }
  res.redirect("/");
})




/*
**************************************************************************************************************
*/







app.use(function (err, res, next) {
  res.status(404).sendFile(__dirname + '/static/404.html');
});
app.listen(3000, function () { // Arranca el servidor en el puerto 3000
  console.log('Example app listening on port 3000!');
});
