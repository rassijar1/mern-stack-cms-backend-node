/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/

require('./config');

const express= require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const fileUpload=require('express-fileupload');
const cors= require ('cors');

/*=============================================
CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
MIDDLEWARE PARA BODY PARSER
=============================================*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit:"10 mb", extended: true }));

// parse application/json
app.use(bodyParser.json({limit:"10 mb", extended: true }));

/*=============================================
MIDDLEWARE PARA FILEUPLOAD
=============================================*/

//default options express-fileupload
app.use(fileUpload());

/*=============================================
 EJECUTAR CORS
=============================================*/
app.use(cors());


/*=============================================
IMPORTAR RUTAS
=============================================*/

app.use( require('./rutas/slide.ruta'));
app.use( require('./rutas/galeria.ruta'));
app.use( require('./rutas/articulos.ruta'));
app.use( require('./rutas/administradores.ruta'));
app.use( require('./rutas/usuarios.ruta'));


/*=============================================
Conexion bd
=============================================*/

mongoose.connect('mongodb://127.0.0.1:27017/apirest')
  .then(() => console.log('Conectado a la base de datos')); 


/*=============================================
Salida puerto
=============================================*/

app.listen(process.env.PORT, ()=>{

	console.log(`Habilitado el puerto ${process.env.PORT}`)
})