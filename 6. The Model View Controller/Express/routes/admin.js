const express = require("express");
const path = require("path");

const productsController = require("../controllers/products")

const router = express.Router();

//const products = [];

/*
router.get("/add-product",(req, res, next) => {
    res.render("add-product",{pageTitle : "Add Product", path : "/admin/add-product"});
});*/

router.get("/add-product", productsController.getAddProduct);

/*
router.post("/add-product", (req, res)=> {
    products.push({title: req.body.title});
    res.redirect("/");
})
*/
router.post("/add-product", productsController.postAddProduct)

module.exports = router;
//exports.products = products;