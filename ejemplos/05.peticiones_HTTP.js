/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/

const express= require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');


/*=============================================
CREAMOS UNA VARIABLE PARA TENER TODAS LAS FUNCIONALIDADES DE EXPRESS
=============================================*/

const app = express();

/*=============================================
MIDDLEWARE PARA BODY PARSER
=============================================*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



/*=============================================
ESQUEMA PARA MODELO CONECTOR A MONGODB
=============================================*/

let Schema= mongoose.Schema;
let slideSchema= new Schema({

imagen:{

	type:String,
	required: [true, "La imagen es obligatoria"]
},
titulo:{

	type:String,
	required: false
},
descripcion:{

	type:String,
	required: false
}



})

const Slide = mongoose.model("slides", slideSchema);

/*=============================================
PETICIONES GET
=============================================*/

app.get('/', (req, res)=> {
  // res.send('Hello World')

  Slide.find({}).then((data) => {
  	res.json({

	status:200,
	data

})
  
}).catch((err) => {
  if (err) {

	return res.json({

		status:500,
		mensaje:"Error en la peticion"

	})
}
});

  

})


/*=============================================
PETICIONES POST
=============================================*/

app.post('/crear-slide', (req, res) =>{

	let slide = req.body;

	res.json({

		slide
	})

})


/*=============================================
PETICIONES PUT
=============================================*/

app.put('/editar-slide/:id', (req, res) =>{

	let id = req.params.id;

	res.json({

		id
	})

})

/*=============================================
PETICIONES DELETE
=============================================*/

app.delete('/borrar-slide/:id', (req, res) =>{

	let id = req.params.id;

	res.json({

		id
	})

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