/*=============================================
IMPORTAR MODELO
=============================================*/

const Slide = require('../modelos/slide.modelo');

/*=============================================
ADMINISTRACION DE CARPETAS Y ARCHIVOS EN NODE JS
=============================================*/
const fs = require('fs');
const path=require('path');

/*=============================================
FUNCION GET
=============================================*/

let mostrarSlide = (req, res) => {
	// res.send('Hello World')

	Slide.find({}).then((data) => {

		//Contar la cantodad de registros

		Slide.countDocuments({}).then((total) => {
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

let crearSlide = (req, res) => {

	//obtener el cuerpo del formulario 
	let body = req.body;
	// console.log("body", body);

	if (!req.files) {

		return res.json({

			status: 500,
			mensaje: "La imagen no puede ir vacia"


		})

	}

	//Capturamos el archivo

	let archivo = req.files.archivo;
	//console.log("archivo", archivo);

	//Validar la extension del archivo

	if (archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png') {
		return res.json({

			status: 400,
			mensaje: "La imagen debe ser formato JPG o PNG"


		})

	}


	//Validar el tamaño del archivo

	if (archivo.size > 2000000) {
		return res.json({

			status: 400,
			mensaje: "La imagen debe ser formato JPG o PNG"


		})

	}


	//Cambiar nombre al archivo

	let nombre = Math.floor(Math.random() * 10000);
	//console.log("nombre", nombre);

	//Capturar extension archivo

	let extension = archivo.name.split('.').pop();
	//console.log("extension", extension);

	//Movemos el archivo a la carpeta

	archivo.mv(`./archivos/slide/${nombre}.${extension}`, err => {

		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error al guardar la imagen",
				err


			})

		}


		//obtener los datos del formulario para pasarlos al modelo 

		let slideModelo = new Slide({

			imagen: `${nombre}.${extension}`,
			titulo: body.titulo,
			descripcion: body.descripcion


		})
		// Guardamos registro en mongo db

		slideModelo.save({}).then((data) => {

			res.json({

				status: 200,
				data,
				mensaje: "El slide ha sido creado correctamente"
			})



		}).catch((err) => {
			if (err) {

				return res.json({

					status: 400,
					mensaje: "Error al almanenar el slide",
					err

				})
			}
		});

	})



}

/*=============================================
FUNCION PUT
=============================================*/

let editarSlide = (req, res) => {

	//capturar id a actualizar
	let id = req.params.id;

	//obtener cuerpo del formulario
	let body = req.body;



	/*=============================================
	1.VALIDAR QUE EL SLIDE SI EXISTA
	=============================================*/

	Slide.findById(id).then((data) => {

		if (!data) {

			res.json({

				status: 400,
				mensaje: "El slide no existe en la base de datos"


			})

		}

		let rutaImagen = data.imagen;

		/*=============================================
		2.VALIDAR QUE HAYA CAMBIO DE IMAGEN
		=============================================*/

		let validarCambioArchivo = (req, rutaImagen) => {

			return new Promise((resolve, reject) => {

				if (req.files) {

					//Capturamos el archivo

					let archivo = req.files.archivo;
					//console.log("archivo", archivo);

					//Validar la extension del archivo

					if (archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png') {


						let respuesta = {


							res: res,
							mensaje: "La imagen debe ser formato JPG o PNG"
						}

						reject(respuesta);

					}


					//Validar el tamaño del archivo

					if (archivo.size > 2000000) {
						let respuesta = {


							res: res,
							mensaje: "La imagen debe ser inferior a 2 MB"
						}

						reject(respuesta);



					}


					//Cambiar nombre al archivo

					let nombre = Math.floor(Math.random() * 10000);
					//console.log("nombre", nombre);

					//Capturar extension archivo

					let extension = archivo.name.split('.').pop();
					//console.log("extension", extension);

					//Movemos archivo carpeta

					archivo.mv(`./archivos/slide/${nombre}.${extension}`, err => {


						if (err) {

							let respuesta = {


								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}


						//Borramos la antigua imagen

						if (fs.existsSync(`./archivos/slide/${rutaImagen}`)) {

							fs.unlinkSync(`./archivos/slide/${rutaImagen}`);

						}

						//Damos valor a la nueva imagen
						rutaImagen = `${nombre}.${extension}`;
						resolve(rutaImagen);

					})

				} else {

					resolve(rutaImagen);
				}


			})

		}

		/*=============================================
		3.ACTUALIZAR LOS REGISTROS
		=============================================*/

		let cambiarRegistrosBD = (id, body, rutaImagen) => {


			return new Promise((resolve, reject) => {

				let datosSlide = {

					imagen: rutaImagen,
					titulo: body.titulo,
					descripcion: body.descripcion

				}

				//Actualizar en mongo DB
				Slide.findByIdAndUpdate(id, datosSlide, {
					new: true,
					runValidators: true
				}).then((data) => {

					//  	res.json({

					// 	status:200,
					// 	data,
					// 	mensaje:"El slide ha sido actualizado correctamente"
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


			})

		}

		/*=============================================
				SINCRONIZAMOS LAS PROMESAS
				=============================================*/

		validarCambioArchivo(req, rutaImagen).then(rutaImagen => {

			cambiarRegistrosBD(id, body, rutaImagen).then(respuesta => {

				respuesta["res"].json({

					status: 200,
					data: respuesta["data"],
					mensaje: "El slide ha sido actualizado con éxito"

				})

			}).catch(respuesta => {

				respuesta["res"].json({

					status: 400,
					err: respuesta["err"],
					mensaje: "Error al editar el slide"

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
FUNCION DELETE
=============================================*/

let borrarSlide = (req, res)=>{

	//Capturamos el id del slide a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL SLIDE SI EXISTA
	=============================================*/	

	Slide.findById(id).then((data) => {

			//Validamos que el Slide exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El slide no existe en la Base de datos"
				
			})	

		}
			//Borramos la antigua imagen

		if(fs.existsSync(`./archivos/slide/${data.imagen}`)){

			fs.unlinkSync(`./archivos/slide/${data.imagen}`);

		}


		// Borramos registro en MongoDB
		Slide.findByIdAndRemove(id).then((data) => {

			res.json({
				status:200,
				mensaje: "El Slide ha sido borrado correctamente"

			})


		}).catch((err) => {
			if(err){

				return res.json({

					status: 500,
					mensaje:"Error al borrar el slide",
					err
				
				})
			}

		});



		}).catch((err) => {
			if(err){

			return res.json({

				status: 500,
				mensaje:"Error en el servidor",
				err
			
			})
			}
		});



}

/*=============================================
FUNCION GET IMAGENES
=============================================*/


let mostrarImg = (req, res) => {
	
	let imagen= req.params.imagen;
	let rutaImagen=`./archivos/slide/${imagen}`;

	fs.exists(rutaImagen,exists=>{
                  if (!exists) {

				return res.json({
					status:400,
					mensaje:"La imagen no existe"

				})
			}


			res.sendFile(path.resolve(rutaImagen));


	})

		
}



/*=============================================
EXPORTAR FUNCIONES DEL CONTROLADOR
=============================================*/

module.exports = {


	mostrarSlide,
	crearSlide,
	editarSlide,
	borrarSlide,
	mostrarImg
}

// app.get('/',function