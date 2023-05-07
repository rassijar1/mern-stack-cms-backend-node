/*=============================================
IMPORTAR EXPRESS
=============================================*/

const express= require('express');
const app = express();

/*=============================================
IMPORTAR CONTROLADOR
=============================================*/

const Galeria=require('../controladores/galeria.controlador');

/*=============================================
IMPORTAR MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');


/*=============================================
CREAR RUTAS HTTP
=============================================*/

app.get('/mostrar-galeria', Galeria.mostrarGaleria);

app.post('/crear-galeria', verificarToken, Galeria.crearGaleria);

app.put('/editar-galeria/:id', verificarToken, Galeria.editarGaleria);

app.delete('/borrar-galeria/:id', verificarToken, Galeria.borrarGaleria);

app.get('/mostrar-img-galeria/:imagen', Galeria.mostrarImg);
 
/*=============================================
EXPORTAR LA RUTA
=============================================*/

module.exports= app;