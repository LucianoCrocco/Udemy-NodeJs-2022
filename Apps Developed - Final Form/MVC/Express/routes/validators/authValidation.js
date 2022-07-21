const {check, body} = require("express-validator");
const User = require("../../models/user");

exports.valPostLogin = 
[
    body("email", "Please enter a valid email address")
    .isEmail()
    .normalizeEmail(),
    body("password", "Password has to be valid")
    .trim()
    .isLength({min : 5})
    .isAlphanumeric(),
]

exports.valPostSignup = 
[ 
check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value) => {
        return User.findOne({email : value})
        .then(userDoc => {
            if(userDoc){
                return Promise.reject("E-Mail exists already, please pick a different one.");
            }
        })
    })
    .normalizeEmail(),

body("password", "Please enter a password with only numbers and text at least 5 characters")
    .trim()
    .isLength({min : 5})
    .isAlphanumeric(),

body("confirmPassword")
    .trim()
    .custom((value, {req}) => {
        if(value === req.body.password){
            return true;
        }
        throw new Error("Passwords have to match!")
    })
]