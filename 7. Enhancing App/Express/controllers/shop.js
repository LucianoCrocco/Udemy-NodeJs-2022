const Product = require("../models/product");
/* SHOP */
exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("./shop/index", {prods : products, pageTitle : "Shop", path : "/"});
    });
}
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("./shop/product-list", {prods : products, pageTitle : "All Products", path : "/products"});
    });
}
exports.getCart = (req, res) => {
    res.render("./shop/cart", {pageTitle : "Your Cart", path : "/cart"});
}

exports.getCheckout = (req, res) => {
    res.render("./shop/checkout", {pageTitle : "Checkout", path : "/checkout"})
}
exports.getOrders = (req, res) => {
    res.render("./shop/orders", {pageTitle : "Your Orders", path : "/orders"});
}