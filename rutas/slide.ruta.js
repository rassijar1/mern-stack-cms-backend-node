
/*=============================================
IMPORTAR EXPRESS
=============================================*/

const express= require('express');
const app = express();

/*=============================================
IMPORTAR CONTROLADOR
=============================================*/

const Slide=require('../controladores/slide.controlador');


/*=============================================
IMPORTAR MIDDLEWARE
=============================================*/

const { verificarToken } = require('../middlewares/autenticacion');

/*=============================================
CREAR RUTAS HTTP
=============================================*/

app.get('/mostrar-slide', Slide.mostrarSlide);

app.post('/crear-slide',verificarToken, Slide.crearSlide);

app.put('/editar-slide/:id',verificarToken, Slide.editarSlide);

app.delete('/borrar-slide/:id',verificarToken, Slide.borrarSlide);

app.get('/mostrar-img/:imagen', Slide.mostrarImg);


/*=============================================
EXPORTAR LA RUTA
=============================================*/

module.exports= app;