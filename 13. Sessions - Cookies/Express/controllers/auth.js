const User = require("../models/user");
exports.getLogin = (req, res, next) => {
    //const isLoggedIn = console.log(req.get("Cookie").split('=')[1])
    res.render("./auth/login", {path : "/login", pageTitle : "Login", isAuthenticated: false})
}

exports.postLogin = (req, res, next) => {
    //req.isLoggedIn = true; -> Una vez que se envia una respuesta muere la peticion.
    //res.setHeader('Set-Cookie', 'loggedIn = true; Expires = ; Max-Age = 10');
    User.findById("62b91f880c118ec5ff2aa4d6")
    .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(err => {
            console.log(err);
            res.redirect("/");
        })
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
}