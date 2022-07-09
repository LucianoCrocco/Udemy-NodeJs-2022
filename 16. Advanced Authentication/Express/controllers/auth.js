const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(process.env.SENDGRID_API);

/* GET */
exports.getLogin = (req, res, next) => {
    res.render("./auth/login", {path : "/login", pageTitle : "Login", errorMessage: req.flash("error")[0]})
}

exports.getSignup = (req, res, next) => {
    res.render('./auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: req.flash("error")[0]
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
        res.redirect("/");
        //console.log(err);
    });
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
        }
    })
    .catch(err => console.log(err))
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