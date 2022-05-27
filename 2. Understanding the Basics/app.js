const http = require("http");

//const routes = require("./routes");
const {requestHandler}= require("./routes");

//const fs = require('fs');
//const { parse } = require("path");
function rqListener (request, response){
    requestHandler(request, response);
    //console.log(request.url, request.method, request.headers); -> Algunos datos que recibimos en la peticion.
    //process.exit(); -> Hard Exit de la peticion
    /*
    response.setHeader('Content-Type', "text/html"); -> Seteo el header de la respuesta
    response.write("<html>"); -> Genero mi HTML
    response.write("<head><title>My first page</title></head>");
    response.write("<body><h1>Hello from my Node.js Server!</h1></body>");
    response.write("</html>"); -> Cierro mi HTML
    response.end(); -> Termino de realizar la respuesta, cierro el objeto y no puedo volver a utilizarlo.
    */
    /* -> Va al routes.js
    const url = request.url;
    const method = request.method;
    if(url === '/'){
        response.setHeader("Content-Type", "text/html");
        response.write("<html>");
        response.write("<head><title>Enter Message</title></head>");
        response.write("<body><form action='/message' method='POST'><input type='text' name='message'><input type ='submit' value='Send'></form></body>");
        response.write("</html>");
        response.end();// Una vez realizado el codigo cierro la respuesta y la retorno y/o me aseguro que la funcion termine alli.
    }  else if (url === '/message' && method === 'POST'){
        const body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
            //console.log(chunk); -> <Buffer 6d 65 73 73 61 67 65 3d 64 73 61 73 64>
        });
        return request.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFile("./message.txt", message, err => {
                response.writeHead(302, {"Location":"/"});
                return response.end();
            })
            //fs.writeFile("./message.txt", message);
            //console.log(parsedBody); -> message=dsasd Dice message porque el input name asociado es ese.
        })
        response.writeHead(302, {"Location":"/"});
        //response.end();
        return response.end(); // Una vez realizado el codigo cierro la respuesta y la retorno y/o me aseguro que la funcion termine alli.
    }*/
}
const server = http.createServer(rqListener);

server.listen(3000);