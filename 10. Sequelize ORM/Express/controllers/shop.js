const Product = require("../models/product");
/* GET */
exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render("./shop/index", {prods : products, pageTitle : "Shop", path : "/"});
    })
    .catch(err => console.log(err));
    /*Product.fetchAll()
    .then(([rows, fieldData]) => {
        res.render("./shop/index", {prods : rows, pageTitle : "Shop", path : "/"});
    })
    .catch(err => console.log(err));*/
}
exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render("./shop/product-list", {prods : products, pageTitle : "All Products", path : "/products"});
    })
    .catch(err => console.log(err));
    /*
    Product.fetchAll()
    .then(([products]) => {
        res.render("./shop/product-list", {prods : products, pageTitle : "All Products", path : "/products"});
    })
    .catch(err => console.log(err));
    */
}

exports.getProduct = (req, res, next) => {
    //Con la condicion Where
    const prodId = req.params.productId;
    Product.findAll({
        where:{
            id : prodId
        }
    })
    .then(products => {
        res.render("./shop/product-detail", {product : products[0], pageTitle : products[0].title, path : "/products"});
    })
    .catch(err => console.log(err));
    // Trayendo con PK
    /*
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    .then(product=> res.render("./shop/product-detail", {product : product, pageTitle : product.title, path : "/products"})) 
    .catch(err => console.log(err));
    */



    
    /*Product.findById(prodId)
    .then(([products]) => {
        res.render("./shop/product-detail", {product : products[0], pageTitle : products[0].title, path : "/products"});
    })
    .catch(err => console.log(err));*/
}

exports.getCart = (req, res) => {
    req.user.getCart()
    .then(cart => {
        return cart
        .getProducts()
        .then(products => {
            res.render("./shop/cart", {pageTitle : "Your Cart", path : "/cart", products : products});
        })
    })
    .catch(err => console.log(err))
    /*
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
    })*/
}

exports.getCheckout = (req, res) => {
    res.render("./shop/checkout", {pageTitle : "Checkout", path : "/checkout"})
}
exports.getOrders = (req, res) => {
    req.user.getOrders({ include : ['products']})
    .then(orders => {
        res.render("./shop/orders", {pageTitle : "Your Orders", path : "/orders", orders : orders});
    })
}

/* POST */
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
      })
      .then(products => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
  
        if (product) {
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId);
      })
      .then(product => {
        return fetchedCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
    /*const product = Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
    })
    res.redirect("/cart");*/
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({where : { id : prodId}});
    })
    .then (products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect("/cart");
    })
    .catch(err => console.log(err))
    /*
    const product = Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
    })
    res.redirect("/cart");*/
}

exports.postOrder = (req, res) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            order.addProducts(products.map(product => {
                product.orderItem = {quantity : product.cartItem.quantity};
                return product;
            }))
        })
        .catch(err => console.log(err));
    })
    .then(result => {
        fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect("/orders");
    })
    .catch(err => console.log(err))
}