const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if(!authHeader){
        const error = new Error("Not autheticated");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = JWT.verify(token, process.env.SECRET_JWT);
    }
    catch (err){
        err.statusCode = 500;
        throw err;
    }
    // if(!decodedToken){ -> En teoria no hace falta, ya que si no puede decodificarlo va driecto al catch.
    //     const error = new Error("Not autheticated");
    //     error.statusCode = 401;
    //     throw error;
    // }
    req.userId = decodedToken.userId; // Lo envia el front al back y lo utilizo para conectarlos.
    next();
}