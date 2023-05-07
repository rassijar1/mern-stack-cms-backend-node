/*=============================================
UBICAMOS LOS REQUERIMIENTOS
=============================================*/

const http= require('http');

/*=============================================
Salida del puerto
=============================================*/

http.createServer((req, res)=>{

// res.write("Hola juan");
// res.end();

/*=============================================
Salida JSON
=============================================*/

res.writeHead(200, {'Content-Type': 'application/json'})

let Salida={

nombre:"juan",
edad: 37,
url: req.url


}

res.write(JSON.stringify(Salida));
res.end();
})
.listen(4000);

console.log("Habilitado el puerto 4000");