/*=============================================
IMPORTAR EXPRESS
=============================================*/

const express= require('express');
const app = express();

/*=============================================
IMPORTAR CONTROLADOR
=============================================*/

const Articulos=require('../controladores/articulos.controlador');

/*=============================================
IMPORTAR MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');


/*=============================================
CREAR RUTAS HTTP
=============================================*/

app.get('/mostrar-articulos', Articulos.mostrarArticulos);

app.post('/crear-articulos',verificarToken, Articulos.crearArticulos);

app.put('/editar-articulos/:id',verificarToken, Articulos.editarArticulos);

app.delete('/borrar-articulos/:id',verificarToken, Articulos.borrarArticulos);

app.get('/mostrar-img-articulo/:imagen', Articulos.mostrarImg);

/*=============================================
EXPORTAR LA RUTA
=============================================*/

module.exports= app;