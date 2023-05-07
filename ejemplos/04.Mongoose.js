/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/

const express= require('express');
const mongoose = require('mongoose');


/*=============================================
CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
PETICIONES GET
=============================================*/

app.get('/', (req, res)=> {
  // res.send('Hello World')
  let Salida={

nombre:"juan",
edad: 37,
url: req.url


}
res.send(Salida);
})

/*=============================================
Conexion bd
=============================================*/
mongoose.connect('mongodb://127.0.0.1:27017/apirest')
  .then(() => console.log('Conectado a la base de datos')); 


/*=============================================
Salida puerto
=============================================*/

app.listen(4000, ()=>{

	console.log("Habilitado el puerto 4000");
})