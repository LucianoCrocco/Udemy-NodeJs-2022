const http = require("http");
const {requestHandler}= require("./routes");

function rqListener (request, response){
    requestHandler(request, response);
}
const server = http.createServer(rqListener);

server.listen(3000); 