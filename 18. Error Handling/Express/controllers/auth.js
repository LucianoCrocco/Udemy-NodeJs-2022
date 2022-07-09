const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendGrid = require("@sendgrid/mail");
const {validationResult} = require("express-validator");

sendGrid.setApiKey(process.env.SENDGRID_API);

/* GET */
exports.getLogin = (req, res, next) => {
    res.render("./auth/login", {
        path : "/login", 
        pageTitle : "Login", 
        errorMessage: req.flash("error")[0],
        oldInput : {
            email : "",
            password : ""
        },
        validationErrors : []
    })
}

exports.getSignup = (req, res, next) => {
    res.render('./auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash("error")[0],
        oldInput : {
            email : "",
            password : "",
            confirmPassword : ""
        },
        validationErrors : []
    });
};

exports.getReset = (req, res, next) => {
    res.render("./auth/reset", {path : "/reset", pageTitle : "Reset Password", errorMessage: req.flash("error")[0]})
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken : token, resetTokenExpiration : {$gt : Date.now()}})
    .then(user => {
        res.render('./auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            errorMessage: req.flash("error")[0],
            userId : user._id.toString(),
            passwordToken : token
        });
    })
    .catch(err => console.log(err))
  
}

/* POST */
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    // console.log(errors)
    // console.log("....")
    // console.log(errors.array())
    if(!errors.isEmpty()){
        return res.status(422).render("./auth/login", {
            path : "/login", 
            pageTitle : "Login", 
            errorMessage: errors.array()[0].msg,
            oldInput : {
                email : email,
                password : password
            },
            validationErrors : errors.array()
        })
    }
    User.findOne({email : email})
    .then(user => {
        if(!user){
            return res.status(422).render("./auth/login", {
                path : "/login", 
                pageTitle : "Login", 
                errorMessage: "Invalid email or passwords.",
                oldInput : {
                    email : email,
                    password : password
                },
                validationErrors : [{param : "email"}, {param : "password"}]
            })
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
                return res.status(422).render("./auth/login", {
                    path : "/login", 
                    pageTitle : "Login", 
                    errorMessage: "Invalid email or passwords.",
                    oldInput : {
                        email : email,
                        password : password
                    },
                    validationErrors : [{param : "email"}, {param : "password"}]
                })
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
        res.redirect("/");
        //console.log(err);
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('./auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput : {
                email : email,
                password : password,
                confirmPassword : req.body.confirmPassword
            },
            validationErrors : errors.array()
        });
    }
    
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({email : email, password : hashedPassword})
        return user.save();
    })
    .then(result => {
        res.redirect("/login");
        return sendGrid.send({
            to : email,
            from : process.env.SENDGRID_EMAIL,
            subject : 'Signup succeded',
            html: '<h1>You succesfully sign up</h1>'
        })
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postReset = (req, res, next) =>{
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
            return res.redirect("/reset")
        }
        const token = buffer.toString('hex');
        User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                req.flash("error", "No account with that Email found");
                return res.redirect("/reset");
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        })
        .then(result => {
            res.redirect("/");
            sendGrid.send({
                to : req.body.email,
                from : process.env.SENDGRID_EMAIL,
                subject : 'Password reset',
                html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password</p>`
            })
        })
        .catch(err => console.log(err))
    })
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken : passwordToken, resetTokenExpiration : {$gt : Date.now()}, _id : userId})
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => res.redirect("/login"))
    .catch(err => console.log(err))
}