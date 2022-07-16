const express = require("express");
const authController = require("../controllers/auth")
const router = express.Router();
const {valPostLogin, valPostSignup} = require("./validators/authValidation")

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post("/login", valPostLogin, authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/signup", valPostSignup, authController.postSignup);
router.post("/reset", authController.postReset);    
router.post("/new-password", authController.postNewPassword)

module.exports = router;