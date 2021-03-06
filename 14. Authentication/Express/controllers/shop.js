const Product = require("../models/product");
const Order = require("../models/order.js")
/* GET */
exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render("./shop/index", {prods : products, pageTitle : "Shop", path : "/"});
    })
    .catch(err => console.log(err));
}
exports.getProducts = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render("./shop/product-list", {prods : products, pageTitle : "All Products", path : "/products"});
    })
    .catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render("./shop/product-detail", {product : product, pageTitle : product.title, path : "/products"});
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res) => {
    req.user
    .populate("cart.items.productId")
    .then(user => {
        const products = user.cart.items;
        res.render("./shop/cart", {pageTitle : "Your Cart", path : "/cart", products : products});
    })
    .catch(err => console.log(err))
}

exports.getCheckout = (req, res) => {
    res.render("./shop/checkout", {pageTitle : "Checkout", path : "/checkout"})
}

exports.getOrders = (req, res) => {
    Order.find({"user.userId" : req.session.user._id})
    .then(orders => {
        res.render("./shop/orders", {pageTitle : "Your Orders", path : "/orders", orders : orders});
    })
}

/* POST */
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product)
    })
    .then((result) => {
        res.redirect('/cart');
        //console.log(result)
    })
    .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
    .then(result => {
        res.redirect("/cart");
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res) => {
    req.user
    .populate("cart.items.productId")
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity : i.quantity, product : {...i.productId._doc}}
        });
        const order = new Order
        (
            {   user : {
                    email : req.session.user.email, 
                    userId : req.session.user._id
                }, 
                products : products
            }
        )
        return order.save()
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(result => {
        res.redirect("/orders");
    })
    .catch(err => console.log(err))
}