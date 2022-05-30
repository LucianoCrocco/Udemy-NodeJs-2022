const fs = require("fs");

function requestHandler(request, response) {
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
        }) 
    }
}

//module.exports = requestHandler;
module.exports = {
    requestHandler
}