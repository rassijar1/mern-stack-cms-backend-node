/*=============================================
IMPORTAR MODELO
=============================================*/

const Usuarios = require('../modelos/usuarios.modelo');

//Modulo para encriptar contraseña

const bcrypt = require('bcrypt');



/*=============================================
FUNCION GET
=============================================*/

let mostrarUsuarios = (req, res) => {



	Usuarios.find({}).then((data) => {

		//Contar la cantodad de registros

		Usuarios.countDocuments({}).then((total) => {
			res.json({

				status: 200,
				total,
				data

			})
		}).catch((err) => {
			if (err) {

				return res.json({

					status: 500,
					mensaje: "Error en la peticion"

				})
			}
		});


	}).catch((err) => {
		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error en la peticion"

			})
		}
	});



}


/*=============================================
FUNCION POST
=============================================*/

let crearUsuario = (req, res) => {

	//obtener el cuerpo del formulario 
	let body = req.body;

	//obtener los datos del formulario para pasarlos al modelo 

	let usuariosModelo = new Usuarios({


		usuario: body.usuario,
		password: bcrypt.hashSync(body.password, 10),
		email:body.email


	})
	// Guardamos registro en mongo db

	usuariosModelo.save({}).then((data) => {

		res.json({

			status: 200,
			data,
			mensaje: "El Usuario ha sido creado correctamente"
		})



	}).catch((err) => {
		if (err) {

			return res.json({

				status: 400,
				mensaje: "Error al almacenar el Usuario",
				err

			})
		}
	});



}



/*=============================================
LOGIN
=============================================*/

let loginUsuario = (req, res)=>{

//obtener cuerpo del formulario
	let body = req.body;

	//Recorrer la base de datos en busqueda de coincidencia con el usuario


	Usuarios.findOne({usuario:body.usuario}).then((data) => {

		//Validamos que el Usuario exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El usuario es incorrecto"
				
			})	

		}


		//validar que la contraseña sea correcta

		if (!bcrypt.compareSync(body.password, data.password)) {

			return res.json({

				status: 400,
				mensaje:"La contraseña es incorrecta"
				
			})	
		}

		

		res.json({
			status:200,
			mensaje:"ok"


		})



	}).catch((err) => {
		if (err) {

			return res.json({

				status: 400,
				mensaje: "Error al almacenar el Usuario",
				err

			})
		}
	});


}

/*=============================================
EXPORTAR FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {


	mostrarUsuarios,
	crearUsuario,
	loginUsuario

}