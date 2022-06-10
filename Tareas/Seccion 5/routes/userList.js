const express = require("express");

const router = express.Router();
const formUserRouter = require("./formUser");

router.get("/", (req, res, next) => {
    res.render("userList", {usrList : formUserRouter.userList, pageTitle : "User List"});
})

module.exports = router;