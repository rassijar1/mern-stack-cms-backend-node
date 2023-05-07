/*=============================================
IMPORTAR MODELO
=============================================*/

const Administradores = require('../modelos/administradores.modelo');

//Modulo para encriptar contraseña

const bcrypt = require('bcrypt');

//Modulo para token autorizacion
const jwt = require('jsonwebtoken');

/*=============================================
FUNCION GET
=============================================*/

let mostrarAdministradores = (req, res) => {



	Administradores.find({}).then((data) => {

		//Contar la cantodad de registros

		Administradores.countDocuments({}).then((total) => {
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

let crearAdministrador = (req, res) => {

	//obtener el cuerpo del formulario 
	let body = req.body;

	//obtener los datos del formulario para pasarlos al modelo 

	let administradoresModelo = new Administradores({


		usuario: body.usuario.toLowerCase(),
		password: bcrypt.hashSync(body.password, 10)


	})
	// Guardamos registro en mongo db

	administradoresModelo.save({}).then((data) => {

		res.json({

			status: 200,
			data,
			mensaje: "El administrador ha sido creado correctamente"
		})



	}).catch((err) => {
		if (err) {

			return res.json({

				status: 400,
				mensaje: "Error al almacenar el administrador",
				err

			})
		}
	});



}

/*=============================================
FUNCION PUT
=============================================*/

let editarAdministrador = (req, res) => {

	//capturar id a actualizar
	let id = req.params.id;

	//obtener cuerpo del formulario
	let body = req.body;



	/*=============================================
	1.VALIDAR QUE EL Administrador SI EXISTA
	=============================================*/

	Administradores.findById(id).then((data) => {

		if (!data) {

			res.json({

				status: 400,
				mensaje: "El Administrador no existe en la base de datos"


			})

		}

		let pass = data.password;



		/*=============================================
		2. VALIDAMOS QUE HAYA CAMBIO DE CONTRASEÑA 
		=============================================*/

		let validarCambioPassword = (body, pass) => {

			return new Promise((resolve, reject) => {

				if (body.password == undefined) {

					resolve(pass);

				} else {

					pass = bcrypt.hashSync(body.password, 10);

					resolve(pass);

				}

			})

		}



		/*=============================================
		3. ACTUALIZAMOS LOS REGISTROS
		=============================================*/

		let cambiarRegistrosBD = (id, body, pass) => {

			return new Promise((resolve, reject) => {

				let datosAdministrador = {

					usuario: body.usuario,
					password: pass

				}

				//Actualizar en mongo DB
				Administradores.findByIdAndUpdate(id, datosAdministrador, {
					new: true,
					runValidators: true
				}).then((data) => {

					//  	res.json({

					// 	status:200,
					// 	data,
					// 	mensaje:"El Administradores ha sido actualizado correctamente"
					// })

					let respuesta = {
						res: res,
						data: data
					}

					resolve(respuesta);



				}).catch((err) => {


					if (err) {

						let respuesta = {
							res: res,
							data: data
						}
						reject(err);
					}
				});

				//Actualizamos en MongoDB
				//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate


			})

		}



		/*=============================================
		SINCRONIZAMOS LAS PROMESAS
		=============================================*/

		validarCambioPassword(body, pass).then(pass => {

			cambiarRegistrosBD(id, body, pass).then(respuesta => {

				respuesta["res"].json({

					status: 200,
					data: respuesta["data"],
					mensaje: "El Administrador ha sido actualizado con éxito"

				})

			}).catch(respuesta => {

				respuesta["res"].json({
					status: 400,
					err: respuesta["err"],
					mensaje: "Error al editar el Administrador"

				})


			})

		}).catch(respuesta => {

			respuesta["res"].json({

				status: 400,
				mensaje: respuesta["mensaje"]

			})

		});



	}).catch((err) => {
		if (err) {

			res.json({

				status: 500,
				mensaje: "Error en el sevidor",
				err


			})
		}
	});



}

/*=============================================
FUNCIÓN DELETE
=============================================*/

let borrarAdministrador = (req, res) => {

	//Capturamos el id del administrador a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL ADMINISTRADOR SI EXISTA
	=============================================*/

	//https://mongoosejs.com/docs/api.html#model_Model.findById


	Administradores.findById(id).then((data) => {

		//Validamos que el Administrador exista

		if (!data) {

			return res.json({

				status: 400,
				mensaje: "El administrador no existe en la Base de datos"

			})

		}

		Administradores.findByIdAndRemove(id).then((data) => {



			res.json({
				status: 200,
				mensaje: "El administrador ha sido borrado correctamente"

			})



		}).catch((err) => {
			if (err) {

				return res.json({

					status: 500,
					mensaje: "Error al borrar el administrador",
					err

				})
			}

		});



	}).catch((err) => {
		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error en el servidor",
				err

			})
		}

	});



}

/*=============================================
LOGIN
=============================================*/

let login = (req, res)=>{

//obtener cuerpo del formulario
	let body = req.body;

	//Recorrer la base de datos en busqueda de coincidencia con el usuario


	Administradores.findOne({usuario:body.usuario}).then((data) => {

		//Validamos que el Administrador exista

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

		//Generar token autorizacion

		let token= jwt.sign({

			data

		},process.env.SECRET, {expiresIn: process.env.CADUCIDAD})

		res.json({
			status:200,
			token,
			data


		})



	}).catch((err) => {
		if (err) {

			return res.json({

				status: 400,
				mensaje: "Error al almacenar el administrador",
				err

			})
		}
	});


}

/*=============================================
EXPORTAR FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {


	mostrarAdministradores,
	crearAdministrador,
	editarAdministrador,
	borrarAdministrador,
	login

}