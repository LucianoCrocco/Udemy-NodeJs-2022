const Product = require("../models/product");
const Cart = require("../models/cart");
/* GET */
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

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (p) => {
        res.render("./shop/product-detail", {product : p, pageTitle : p.title, path : "/products"});
        //console.log(p);
    })
    //console.log(prodId);
    //res.redirect("./shop/product-detail");
}

exports.getCart = (req, res) => {
    Cart.getCart((cart) => {
        Product.fetchAll(products => {
            const cartProducts = []
            for(product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData){
                    cartProducts.push({productData : product, qty : cartProductData.qty});
                }
            }
            res.render("./shop/cart", {pageTitle : "Your Cart", path : "/cart", products : cartProducts});
        });
    })
}

exports.getCheckout = (req, res) => {
    res.render("./shop/checkout", {pageTitle : "Checkout", path : "/checkout"})
}
exports.getOrders = (req, res) => {
    res.render("./shop/orders", {pageTitle : "Your Orders", path : "/orders"});
}

/* POST */
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(product.id, product.price)
    })
    res.redirect("/cart");
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const product = Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
    })
    res.redirect("/cart");
}