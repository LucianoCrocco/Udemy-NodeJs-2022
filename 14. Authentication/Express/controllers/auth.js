const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
    //const isLoggedIn = console.log(req.get("Cookie").split('=')[1])
    res.render("./auth/login", {path : "/login", pageTitle : "Login", errorMessage: req.flash("error")[0]})
}

exports.getSignup = (req, res, next) => {
    res.render('./auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: req.flash("error")[0]
    });
  };

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email : email})
    .then(user => {
        if(!user){
            req.flash("error", "Invalid email or passwords.");
            return res.status(401).redirect("/login");
        }
        bcrypt.compare(password, user.password).
        then(doMatch => {
            if(doMatch){
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save(err => {
                    //console.log(err);
                    res.redirect("/");
                })
            } else {
                req.flash("error", "Invalid email or passwords.");
                res.redirect("/login")
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect("/login")
        })
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        //console.log(err);
    });
    res.redirect("/");
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirmPassword;  
    User.findOne({email : email})
    .then(userDoc => {
        if(userDoc) {
            req.flash("error", "E-Mail exists already, please pick a different one.");
            return res.status(409).redirect("/signup");
        } else {
            return bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const user = new User({email : email, password : hashedPassword})
                return user.save();
            })
            .then(result => {
                res.redirect("/login");
            });
        }
    })
    .catch(err => console.log(err))
};