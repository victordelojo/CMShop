var express = require('express');
var app = express();
var body_parser = require('body-parser'); // Poder parsear los datos para los métodos POST
var useAdmin = require("./controller_db/Admin.js")
var fs = require('fs');
var https = require('https');
const fileUpload = require('express-fileupload');
var DB_CONF = "";
var adminD = "admin";
try {
    fs.accessSync('./CONFIGURE.json');
    DB_CONF = require("./CONFIGURE.json") //Carga la configuración
    adminD = DB_CONF.Direccion_Admin;
} catch (err) {
    console.log("No existe configuración del CMShop")
}
const session = require('express-session'); // Para poder manejar sesiones
var cookie = require("cookie-parser") // Para poder manejar las cookies
var nodemailer = require('nodemailer'); // Para enviar correos
var favicon = require('serve-favicon');



// Rutas 

var inicio = require("./router/index");
var admin = require("./router/admin");
var correo = require("./router/correo");
var ajax = require("./router/ajax")

app.use(fileUpload())
app.use(favicon(__dirname + '/static/favicon.ico')); // 
app.use(express.static("static")) // Añade la carpeta con los archivos estaticos de la aplicación
app.use(body_parser.urlencoded({ extended: true })); // Usa el parseo para el metodo POST
app.set("view engine", "pug") // Indicamos el motor de plantilla que utilizaremos  

app.use(session({ secret: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), resave: false, saveUninitialized: true })); //Usa sieiones con una frase secreta
app.use(cookie()) //Usa las cookies


// Connection URL


/*
ROUTING
**************************************************************************************************************
*/

app.use("/", inicio);



app.use("/" + adminD, admin)

app.use("/correo", correo)

app.use("/ajax", ajax)

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
            /*

            ENCRIPTADO


            var crypto = require('crypto'),
                algorithm = 'aes-256-ctr',
                password = 'd6F3Efeq';
            var cipher = crypto.createCipher(algorithm,password)
            var crypted = cipher.update(text,'utf8','hex')
            crypted += cipher.final('hex');
            */
            await fs.writeFileSync('./CONFIGURE.json', JSON.stringify({
                "_comentario": "Configuración de la base de datos",

                "db_user": req.body.usuarioDB,
                "db_auth": req.body.accesoDB,
                "db_pass": req.body.passDB,
                "db_port": req.body.portDB,
                "db_direccion": req.body.direccionDB,
                "db_name": req.body.nombreDB,


                "_comentario": "Configuración del Sitio Web",

                "tema": "default",
                "direccion": req.body.nombreHost,
                "port": req.body.portHost,
                "Direccion_Admin": "admin",
                "https": false,
                "SMTP": false
            }, null, 4));
            DB_CONF.port = req.body.portHost;
            var url = 'mongodb://' + req.body.usuarioDB + ':' + req.body.passDB + '@' + req.body.direccionDB + ':' + req.body.portDB + '?authMechanism=DEFAULT&authSource=' + req.body.accesoDB + '';
            var userAdmin = new useAdmin(url, req.body.nombreDB);
            userAdmin.insertar({ "nombreAdmin": nombre, "correoAdmin": email, "contraAdmin": pass })
            var exec = require('child_process').exec,
                child;
            child = exec('pm2 restart app.js')
        }
    }
    res.redirect("http://" + req.body.nombreHost);
})




/*
 **************************************************************************************************************
 */







app.use(function(err, res, next) {
    res.status(404).sendFile(__dirname + '/static/404.html');
});

if (DB_CONF.https) {

    //Redireccionamiento de http a https
    var http = express();

    http.get('*', function(req, res) {
        res.redirect('https://' + req.headers.host + req.url);
    })

    http.listen(80)

    //creación de servidor https

    var privateKey = fs.readFileSync(DB_CONF.httpsKey, 'utf8');
    var certificate = fs.readFileSync(DB_CONF.httpsCrt, 'utf8');

    var credentials = { key: privateKey, cert: certificate };

    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(443);
    console.log(`Example app listening on port ${DB_CONF.port || 3000}!`);
} else {
    app.listen(DB_CONF.port || 3000, function() { // Arranca el servidor e
        console.log(`Example app listening on port ${DB_CONF.port || 3000}!`);
    });
}