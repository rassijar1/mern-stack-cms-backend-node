/*=============================================
ESQUEMA PARA MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema= mongoose.Schema;
let articulosSchema= new Schema({

portada:{

	type:String,
	required: [true, "La imagen es obligatoria"]
},
titulo:{

	type:String,
	required:  [true, "el titulo  es obligatorio"]
},
intro:{

	type:String,
	required:  [true, "La introduccion es obligatoria"]
},
url:{

	type:String,
	required:  [true, "La url es obligatoria"]
},
contenido:{

	type:String,
	required:  [true, "El contenido es obligatorio"]
}




})


/*=============================================
EXPORTAR EL MODELO
=============================================*/
module.exports= mongoose.model("articulos", articulosSchema);
