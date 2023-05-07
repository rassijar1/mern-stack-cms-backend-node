
/*=============================================
ESQUEMA PARA MODELO CONECTOR A MONGODB
=============================================*/
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

let Schema= mongoose.Schema;
let usuariosSchema= new Schema({

usuario:{

	type:String,
	required: [true, "El usuario  es obligatorio"],
	unique: [true, 'Must be at least 6, got {VALUE}']


},
password:{

	type:String,
	required: [true, "La contraseña es obligatoria"]
},

email:{

	type:String,
	required: [true, "El email es obligatoria"],
	unique:true

}



})

/*=============================================
EVITAR DEVOLVER EN LA DATA EL CAMPO PASSWORD
=============================================*/

usuariosSchema.methods.toJSON = function(){

let usuario = this;
let usuarioObject = usuario.toObject();
delete usuarioObject.password;

return usuarioObject;

}

/*=============================================
DEVOLVER MENSAJE PERSONALIZADO
=============================================*/

usuariosSchema.plugin(beautifyUnique);

/*=============================================
EXPORTAR EL MODELO
=============================================*/

module.exports = mongoose.model("usuarios", usuariosSchema);
