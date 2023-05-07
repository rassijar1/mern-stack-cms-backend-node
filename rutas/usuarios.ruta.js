/*=============================================
IMPORTAR EXPRESS
=============================================*/

const express= require('express');
const app = express();

/*=============================================
IMPORTAR CONTROLADOR
=============================================*/

const Usuarios=require('../controladores/usuarios.controlador');


/*=============================================
CREAR RUTAS HTTP
=============================================*/

app.get('/mostrar-Usuarios', Usuarios.mostrarUsuarios);

app.post('/crear-usuario', Usuarios.crearUsuario);

//login
app.post('/login-usuario', Usuarios.loginUsuario);

/*=============================================
EXPORTAR LA RUTA
=============================================*/

module.exports= app;