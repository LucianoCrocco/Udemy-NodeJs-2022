const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
    res.render("./admin/edit-product",{pageTitle : "Add Product", path : "/admin/add-product", editing : false});
}
exports.postAddProduct = (req, res) => {
    /*
    const product = new Product(null, req.body.title, req.body.imageUrl, req.body.price, req.body.description); 
    product.save().then(() => {
        res.redirect("/admin/products");
    }).catch(err => console.log(err));
    */ 
    req.user.createProduct({
        title : req.body.title,
        price : req.body.price,
        imageUrl : req.body.imageUrl,
        description : req.body.description
    })
    /*
    Product.create({
        title : req.body.title,
        price : req.body.price,
        imageUrl : req.body.imageUrl,
        description : req.body.description
        userId : req.user.id
    })
    */
    .then(result => {
        /*console.log(result)*/
        console.log("Created product");
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
}


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect("/");
    }
    const prodId = req.params.productId;

    //Product.findByPk(prodId)
    req.user.getProducts({where : {id : prodId}})
    .then(/*product*/ products => {
        const product = products[0]; 
        if(!product){
            return res.redirect("/");
        }
        res.render("./admin/edit-product",{pageTitle : "Edit Product", path : "/admin/edit-product", editing : editMode, product : product});
    }).catch(err => console.log(err));


    /*Product.findById(prodId, (product) => {
        if(!product){
            return res.redirect("/");
        }
        res.render("./admin/edit-product",{pageTitle : "Edit Product", path : "/admin/edit-product", editing : editMode, product : product});
    })*/
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findByPk(prodId)
    .then(product => {
        if(!product){
            return res.redirect("/");
        }
        product.title = updatedTitle;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        product.price = updatedPrice;
        return product.save();
    })
    .then(result => {
        console.log("Product updated"); 
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
    /*const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
    updatedProduct.save();*/

}


exports.getProducts = (req, res) => {
    
    //Product.findAll()
    req.user.getProducts()
    .then(products => {
        res.render("./admin/products", {prods : products, pageTitle : "Admin Products", path : "/admin/products"});
    })
    .catch(err => console.log(err));
}


exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        console.log(product);
        return product.destroy()
    })
    .then(result => {
        console.log("Destroy product")
        res.redirect("/admin/products")
    })
    .catch(err => console.log(err))


    /*const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect("/admin/products")*/

}