var express = require('express');
var app = express.Router();
var admin = require("../controller_db/Admin.js")
var fs = require("fs")
var Categoria = require("../controller_db/Categoria")
var Producto = require("../controller_db/Producto")
var Usuario = require("../controller_db/Usuario")
var nodemailer = require('nodemailer');

app.post("/bienvenido", async function (req, res) {
    if (!fs.existsSync(__dirname + "/../CONFIGURE.json")) {
        var DB_CONF = require("../CONFIGURE.json") //Carga la configuración de la base de datos
        var url = 'mongodb://' + DB_CONF.db_user + ':' + DB_CONF.db_pass + '@' + DB_CONF.db_direccion + ':' + DB_CONF.db_port + '?authMechanism=DEFAULT&authSource=' + DB_CONF.db_auth + '';
        var usuAdmin = new admin(url, DB_CONF.db_name);
        if (await usuAdmin.comprobarInicio()) {
            if (req.session.nombre) {
                if (DB_CONF.SMTP) {
                    var correoDestino = req.body.correo;
                    /*

                    Encriptado


                    var crypto = require('crypto'),
                        algorithm = 'aes-256-ctr',
                        password = 'd6F3Efeq';
                    var decipher = crypto.createDecipher(algorithm, password)
                    var dec = decipher.update(DB_CONF.SMTP_contrasenia, 'hex', 'utf8')
                    dec += decipher.final('utf8');
                    DB_CONF.SMTP_contrasenia=dec
                    */

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: DB_CONF.SMTP_correo,
                            pass: DB_CONF.SMTP_contrasenia
                        }
                    });

                    var mailOptions = {
                        from: DB_CONF.SMTP_correo,
                        to: correoDestino,
                        subject: 'Bienvenido a CMShop',
                        html: '<h1>Muchas gracias de utilizar CMShop</h1><br>\
              '
                    };
                    transporter.sendMail(mailOptions, async function (error, info) {
                        if (error) {
                            res.json({ estado: false, error: "No se ha podido enviar el correo" });
                        } else {
                            res.json({ estado: true })
                        }
                    })
                } else {
                    res.json({ estado: false, error: "No esta habilitado la opción de envio de email" })
                }

            } else {
                res.json({ estado: false, error: "No estas logueado" });
            }
        } else {
            res.json({ estado: false, error: "No existe un usuario administrador" });
        }
    } else {
        res.json({ estado: false, error: "No hay una configuración de CMShop" })
    }
})
module.exports = app;