const http = require("http");
function rqListener (request, response){
    console.log(request.url, request.method, request.headers);
    //process.exit();
}
const server = http.createServer(rqListener);

server.listen(3000);