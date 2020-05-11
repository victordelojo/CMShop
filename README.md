<h1>Bienvenidos a CMShop</h1>

<p>Un CMS sencillo donde podrás crear vuestras tiendas online facimente</p>
<p>
Antes de la descarga del CMShop debes de tener instalado:
<ul>
<li>npm</li>
<li>git</li>
<li>MongoDB</li>
<li>node > v8.10.0</li>
<li>Gestro de servicio pm2</li>
</ul>
</p>
<p>Para iniciar la aplicacion sigues los siguientes pasos en la terminal:</p>
<ul>
<li>Obtener CMShop: git clone https://github.com/victordelojo/CMShop</li>
<li>Entramos en la carpeta CMShop</li>
<li>Dentro de esa carpeta instalamos las dependencias: npm install</li>
<li>Arrancamos el servidor CMShop: pm2 start app.js</li>
<li>Vamos al navegador y entramos en http://localhost:3000 para la configuración de CMShop</li>
<li>Para que arranque el servidor al inicio ejecutamos:
<ul>
<li>Dentro de la carpeta: pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freebsd | systemd | systemv | upstart | launchd | rcd | openrc]</li>
Si instalas dentro de una distribución linux debes de especificar la distribución, si estas en macos o windows puedes ejecutar solo el comando pm2 startup.
<li>Generará un comando que se deberá de ejecutar como administrador</li>
</ul>
</ul>
<br>
<h2>
Posibles problemas:
</h2>
<ul>
<li>Inicia servicio y no accede al sitio web en el navegador al poner el puerto 80: 
<ul>
<li>
Instalamos authbind
</li>
<li>Ejecutamos los siguientes comandos: (%user% es el nombre de usuario que vamos a utilizar para el arranque del servicio)<br><b>
sudo touch /etc/authbind/byport/80</b><br><b>
sudo chown %user% /etc/authbind/byport/80</b><br><b>
sudo chmod 755 /etc/authbind/byport/80</b>
</li>
<li>
Luego ejecutamos el siguiente comando: <br><b>alias pm2='authbind --deep pm2'</b>
</li>
<li>
Ya podemos utilizar el comando : <br><b>pm2 start -f app.js</b>
</li>
</ul>
</li><br>
<li>
Al Terminar la configuración de CMShop vuelve a pedir los parámetros de configuración <br> <b>Reinicia el servicio</b>.
</li><br>
<li>
No inicia sesión en admin <br> Comprobar si la dirección de donde está alojado el CMShop esta bien configurado en el archivo <b>CONFIGURE.json</b>
</li>
</ul>
