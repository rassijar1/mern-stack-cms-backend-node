
/*=============================================
ESQUEMA PARA MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');

let Schema= mongoose.Schema;
let administradoresSchema= new Schema({

usuario:{

	type:String,
	required: [true, "El usuario  es obligatorio"],
	unique:true
},
password:{

	type:String,
	required: [true, "La contraseña es obligatoria"]
}



})

/*=============================================
EVITAR DEVOLVER EN LA DATA EL CAMPO PASSWORD
=============================================*/

administradoresSchema.methods.toJSON = function(){

let administrador = this;
let adminObject = administrador.toObject();
delete adminObject.password;

return adminObject;

}


/*=============================================
EXPORTAR EL MODELO
=============================================*/

module.exports = mongoose.model("administradores", administradoresSchema);
