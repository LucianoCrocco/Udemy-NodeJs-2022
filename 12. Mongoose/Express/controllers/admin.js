const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
    res.render("./admin/edit-product",{pageTitle : "Add Product", path : "/admin/add-product", editing : false});
}
exports.postAddProduct = (req, res) => {
    const product = new Product ({title: req.body.title, price : req.body.price, imageUrl : req.body.imageUrl, description : req.body.description, userId : req.user._id})
    product.save()
    .then(result => {
        console.log("Created product");
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
}


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;

    if(!editMode){
        return res.redirect("/");
    }
    
    Product.findById(prodId)
    .then(product => {
        if(!product){
            return res.redirect("/");
        }
        res.render("./admin/edit-product",{pageTitle : "Edit Product", path : "/admin/edit-product", editing : editMode, product : product});
    }).catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.updateOne({_id : prodId}, {title : updatedTitle, price : updatedPrice, imageUrl : updatedImageUrl, description : updatedDescription})
    .then(result => {
        console.log("Product updated"); 
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
}


exports.getProducts = (req, res) => {
    Product.find()
    //.populate("userId", "name email -_id")
    .then(products => {
        console.log(products)
        res.render("./admin/products", {prods : products, pageTitle : "Admin Products", path : "/admin/products"});
    })
    .catch(err => console.log(err));
}


exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then(result => {
        console.log("Destroy product")
        res.redirect("/admin/products")
    })
    .catch(err => console.log(err))

}