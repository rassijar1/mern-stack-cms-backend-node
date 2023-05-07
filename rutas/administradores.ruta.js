/*=============================================
IMPORTAR EXPRESS
=============================================*/

const express= require('express');
const app = express();

/*=============================================
IMPORTAR CONTROLADOR
=============================================*/

const Administradores=require('../controladores/administradores.controlador');

/*=============================================
IMPORTAR MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');



/*=============================================
CREAR RUTAS HTTP
=============================================*/

app.get('/mostrar-administradores', verificarToken, Administradores.mostrarAdministradores);

app.post('/crear-administrador', verificarToken, Administradores.crearAdministrador);

app.put('/editar-administrador/:id', verificarToken, Administradores.editarAdministrador);

app.delete('/borrar-administrador/:id',verificarToken, Administradores.borrarAdministrador);

//login
app.post('/login', Administradores.login);

/*=============================================
EXPORTAR LA RUTA
=============================================*/

module.exports= app;