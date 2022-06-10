const Product = require("../models/product");

/* ADMIN */
exports.getAddProduct = (req, res, next) => {
    res.render("./admin/add-product",{pageTitle : "Add Product", path : "/admin/add-product"});
}
exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title, req.body.imgUrl, req.body.price, req.body.description);
    product.save();
    res.redirect("/");
}
exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render("./admin/products", {prods : products, pageTitle : "Admin Products", path : "/admin/products"});
    });
}
