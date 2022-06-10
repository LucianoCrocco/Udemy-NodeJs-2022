const express = require("express");

const router = express.Router();

const userList = []; 

router.get("/add-user", (req, res, next) => {
    res.render("form.ejs", {pageTitle : "Form User"});
})

router.post("/add-user", (req, res, next) => {
    userList.push({usrName : req.body.name});
    res.redirect("/");
})

exports.routes = router;
exports.userList = userList;