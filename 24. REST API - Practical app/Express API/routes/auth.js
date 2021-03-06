const express = require("express");
const {body} = require("express-validator");
const UserModel = require("../models/user");
const router = express.Router();
const authController = require("../controller/auth");
const isAuth = require("../middleware/is-auth");


router.get("/status", isAuth, authController.getStatus);

router.put("/signup", [
    body("email", "Enter a valid email")
    .isEmail()
    .custom((value)=> {
        return UserModel.findOne({email : value})
        .then(user => {
            if(user){
                return Promise.reject("E-mail address already exists");
            }
        })
    })
    .normalizeEmail(),
    body("name", "Enter a valid name")
    .trim()
    .not()
    .isEmpty(),
    body("password", "Enter a valid password")
    .trim()
    .isLength({min : 5}),
],
authController.signup);

router.post("/login", authController.login)

router.patch("/status", 
isAuth,
[
    body("status", "Enter a valid status")
    .trim()
    .isString()
], 
authController.updateUserStatus);

module.exports = router;