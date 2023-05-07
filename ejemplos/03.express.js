/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/

const express= require('express');

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

app.listen(4000, ()=>{

	console.log("Habilitado el puerto 4000");
})