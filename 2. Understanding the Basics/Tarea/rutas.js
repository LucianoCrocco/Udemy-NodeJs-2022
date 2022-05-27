const { parse } = require("path");

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.write("<html>");
        res.write("<h1>Ejercicio de la Sección \"Understanding the Basics\"</h1>")
        res.write("<form action='/create-user' method='POST'> <input type='text' placeholder='Username' name='username'> <input type='submit'></form>")
        res.write("</html>");
        res.end();
        return res;
    } else if(url==="/users"){
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.write("<html>");
        res.write("<ul>");
        res.write("<li>Luciano: 1</li>");
        res.write("<li>Martin: 2</li>");
        res.write("<li>Maximilian: 3</li>");
        res.write("<li>Gerardo: 4</li>");
        res.write("</ul>");
        res.write("</html>");
        res.end();
        return res; 
    } else if (url === '/create-user' && method === 'POST'){
        const parsedBody = [];
        req.on("data", (chunk) => {
            parsedBody.push(chunk);
        })
        req.on("end", () => {
            const message = Buffer.concat(parsedBody).toString();
            console.log(message);
            res.setHeader("Location","/");
            res.statusCode = 302;
            return res.end();
        })
    }
}

module.exports = {
    requestHandler
}