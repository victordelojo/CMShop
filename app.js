var express = require('express');
var app = express();
var body_parser = require('body-parser'); // Poder parsear los datos para los métodos POST
var useAdmin = require("./controller_db/Admin.js")
var fs = require('fs');
var https = require('https')
var DB_CONF = "";
var adminD = "admin";
try {
    fs.accessSync('./CONFIGURE.json');
    DB_CONF = require("./CONFIGURE.json") //Carga la configuración
    adminD = DB_CONF.Direccion_Admin;
} catch (err) {
    console.log("no esta")
}
const session = require('express-session'); // Para poder manejar sesiones
var nodemailer = require('nodemailer'); // Para enviar correos
var favicon = require('serve-favicon');



// Rutas 

var inicio = require("./router/index");
var admin = require("./router/admin");


app.use(favicon(__dirname + '/static/logo.png')); // 
app.use(express.static("static")) // Añade la carpeta con los archivos estaticos de la aplicación
app.use(body_parser.urlencoded({ extended: true })); // Usa el parseo para el metodo POST
app.set("view engine", "pug") // Indicamos el motor de plantilla que utilizaremos  

app.use(session({ secret: 'AltoSecreto', resave: false, saveUninitialized: true })); //Usa sieiones con una frase secreta

var hola;


// Connection URL


/*
ROUTING
**************************************************************************************************************
*/

app.use("/", inicio);



app.use("/" + adminD, admin)

app.post("/confCMShopUser", async function(req, res) {
    if (!fs.existsSync(__dirname + "/../CONFIGURE.json")) {
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
            await transporter.sendMail(mailOptions, async function(error, info) {
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
                        "Direccion_Admin": "admin"
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
                "Direccion_Admin": "admin"
            }, null, 4));
            DB_CONF.port = req.body.portHost;
            var url = 'mongodb://' + req.body.usuarioDB + ':' + req.body.passDB + '@' + req.body.direccionDB + ':' + req.body.portDB + '?authMechanism=DEFAULT&authSource=' + req.body.accesoDB + '';
            var userAdmin = new useAdmin(url, req.body.nombreDB);
            userAdmin.insertar({ "nombre": nombre, "email": email, "pass": pass })

        }
    }
    res.redirect("/");
})




/*
 **************************************************************************************************************
 */







app.use(function(err, res, next) {
    res.status(404).sendFile(__dirname + '/static/404.html');
});

if (DB_CONF.https) {

    var privateKey = fs.readFileSync(DB_CONF.httpsKey, 'utf8');
    var certificate = fs.readFileSync(DB_CONF.httpsCrt, 'utf8');

    var credentials = { key: privateKey, cert: certificate };

    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(DB_CONF.port || 3000);
} else {
    app.listen(DB_CONF.port || 3000, function() { // Arranca el servidor e
        console.log('Example app listening on port 3000!');
    });
}