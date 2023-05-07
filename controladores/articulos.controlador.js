/*=============================================
IMPORTAR MODELO
=============================================*/

const Articulos = require('../modelos/articulos.modelo');

/*=============================================
ADMINISTRACION DE CARPETAS Y ARCHIVOS EN NODE JS
=============================================*/
const fs = require('fs');
const mkdirp= require('mkdirp');
const rimraf= require('rimraf');
const path=require('path');

/*=============================================
FUNCION GET
=============================================*/

let mostrarArticulos = (req, res) => {
	// res.send('Hello World')

	Articulos.find({}).then((data) => {

		//Contar la cantodad de registros

		Articulos.countDocuments({}).then((total) => {
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

let crearArticulos = (req, res) => {

	//obtener el cuerpo del formulario 
	let body = req.body;
	// console.log("body", body);

	if (!req.files) {

		return res.json({

			status: 500,
			mensaje: "La Portada del articulo no puede ir vacia"


		})

	}

	//Capturamos el archivo

	let archivo = req.files.archivo;
	//console.log("archivo", archivo);

	//Validar la extension del archivo

	if (archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/jpg' && archivo.mimetype != 'image/png') {
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

	//Creamos la nueva carpeta con el nombre de la URL.

	let crearCarpeta= mkdirp.sync(`./archivos/articulos/${body.url}`);


	//Movemos el archivo a la carpeta

	archivo.mv(`./archivos/articulos/${body.url}/${nombre}.${extension}`, err => {

		if (err) {

			return res.json({

				status: 500,
				mensaje: "Error al guardar la imagen",
				err


			})

		}


		//obtener los datos del formulario para pasarlos al modelo 

		let articulosModelo = new Articulos({

			portada: `${nombre}.${extension}`,
			titulo: body.titulo,
			intro: body.intro,
			url:body.url,
			contenido:body.contenido


		})
		// Guardamos registro en mongo db

		articulosModelo.save({}).then((data) => {

			res.json({

				status: 200,
				data,
				mensaje: "El Articulo ha sido creado correctamente"
			})



		}).catch((err) => {
			if (err) {

				return res.json({

					status: 400,
					mensaje: "Error al almacenar el Articulo",
					err

				})
			}
		});

	})



}

/*=============================================
FUNCION PUT
=============================================*/

let editarArticulos = (req, res) => {

	//capturar id a actualizar
	let id = req.params.id;

	//obtener cuerpo del formulario
	let body = req.body;



	/*=============================================
	1.VALIDAR QUE EL Articulo SI EXISTA
	=============================================*/

	Articulos.findById(id).then((data) => {

		if (!data) {

			res.json({

				status: 400,
				mensaje: "El Articulo no existe en la base de datos"


			})

		}

		let rutaImagen = data.portada;

		/*=============================================
		2.VALIDAR QUE HAYA CAMBIO DE IMAGEN
		=============================================*/

		let validarCambioArchivo = (req, body, rutaImagen) => {

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

					archivo.mv(`./archivos/articulos/${body.url}/${nombre}.${extension}`, err => {


						if (err) {

							let respuesta = {


								res: res,
								mensaje: "Error al guardar la imagen"
							}

							reject(respuesta);

						}


						//Borramos la antigua imagen

						if (fs.existsSync(`./archivos/articulos/${body.url}/${rutaImagen}`)) {

							fs.unlinkSync(`./archivos/articulos/${body.url}/${rutaImagen}`);

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

				let datosArticulos = {

					portada: rutaImagen,
					titulo: body.titulo,
					intro: body.intro,
					url: body.url,
					contenido: body.contenido


				}

				//Actualizar en mongo DB
				Articulos.findByIdAndUpdate(id, datosArticulos, {
					new: true,
					runValidators: true
				}).then((data) => {

					//  	res.json({

					// 	status:200,
					// 	data,
					// 	mensaje:"El Articulos ha sido actualizado correctamente"
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

		validarCambioArchivo(req, body, rutaImagen).then(rutaImagen => {

			cambiarRegistrosBD(id, body, rutaImagen).then(respuesta => {

				respuesta["res"].json({

					status: 200,
					data: respuesta["data"],
					mensaje: "El Articulo ha sido actualizado con éxito"

				})

			}).catch(respuesta => {

				respuesta["res"].json({

					status: 400,
					err: respuesta["err"],
					mensaje: "Error al editar el Articulo"

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

let borrarArticulos = (req, res)=>{

	//Capturamos el id del Articulos a borrar

	let id = req.params.id;

	/*=============================================
	1. VALIDAMOS QUE EL Articulos SI EXISTA
	=============================================*/	

	Articulos.findById(id).then((data) => {

			//Validamos que el Articulos exista

		if(!data){

			return res.json({

				status: 400,
				mensaje:"El Articulo no existe en la Base de datos"
				
			})	

		}
			//Borramos la carpeta del articulo

		let rutaCarpeta = `./archivos/articulos/${data.url}`;
		rimraf.sync(rutaCarpeta);

		// Borramos registro en MongoDB
		Articulos.findByIdAndRemove(id).then((data) => {

			res.json({
				status:200,
				mensaje: "El Articulo ha sido borrado correctamente"

			})


		}).catch((err) => {
			if(err){

				return res.json({

					status: 500,
					mensaje:"Error al borrar el Articulo",
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
	
	let imagen= req.params.imagen.split('+');
	let rutaImagen=`./archivos/articulos/${imagen[0]}/${imagen[1]}`;

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


	mostrarArticulos,
	crearArticulos,
	editarArticulos,
	borrarArticulos,
	mostrarImg
}

// app.get('/',function