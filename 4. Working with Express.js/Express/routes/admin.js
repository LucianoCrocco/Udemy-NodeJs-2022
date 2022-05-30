const express = require("express");
const path = require("path");

const rootDir = require("../helpers/path");

const router = express.Router();

router.get("/add-product",(req, res, next) => {
    //res.send("<h1>Add Product</h1>");
    //res.send("<form action='/admin/add-product' method='POST'><input type='text' name='title'><input type='submit' value='Add Product'></form>")
    //res.sendFile(path.join(__dirname, "../views", "add-product.html" ));
    res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/add-product", (req, res)=> {
    console.log(req.body)
    res.redirect("/");
})


module.exports = router;