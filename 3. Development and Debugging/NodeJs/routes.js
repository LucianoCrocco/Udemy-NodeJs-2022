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
        response.end();
    }  else if (url === '/message' && method === 'POST'){
        const body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
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