const express = require("express");
const path = require("path");

const rootDir = require("../helpers/path");

const router = express.Router();

const adminData = require("./admin");

router.get("/",(req, res, next) => {
    //res.sendFile(path.join(rootDir, "views", "shop.html"));
    const products = adminData.products;
    res.render("shop", {prods : products, pageTitle : "Shop", path : "/"}) // PUG y EJS
    //res.render('shop', {prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true}); -> Handlebars
});

module.exports = router;