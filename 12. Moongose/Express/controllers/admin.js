const { ObjectId } = require("mongodb");
const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
    res.render("./admin/edit-product",{pageTitle : "Add Product", path : "/admin/add-product", editing : false});
}
exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title, req.body.price, req.body.imageUrl, req.body.description, null, req.user._id);
    product.save()
    .then(result => {
        /*console.log(result)*/
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
    const updatedProduct = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDescription, prodId);

    updatedProduct.save()
    .then(result => {
        console.log("Product updated"); 
        res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
}


exports.getProducts = (req, res) => {
    Product.fetchAll()
    .then(products => {
        res.render("./admin/products", {prods : products, pageTitle : "Admin Products", path : "/admin/products"});
    })
    .catch(err => console.log(err));
}


exports.postDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId)
    .then(result => {
        console.log("Destroy product")
        res.redirect("/admin/products")
    })
    .catch(err => console.log(err))

}