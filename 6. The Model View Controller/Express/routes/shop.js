const express = require("express");
const path = require("path");

//const rootDir = require("../helpers/path");
const productsController = require("../controllers/products");

const router = express.Router();

//const adminData = require("./admin");

/*
router.get("/",(req, res, next) => {
    const products = adminData.products;
    res.render("shop", {prods : products, pageTitle : "Shop", path : "/"});
});
*/
router.get("/", productsController.getProducts);

module.exports = router;