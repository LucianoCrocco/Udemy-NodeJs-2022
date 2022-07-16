const Product = require("../models/product");
const {validationResult }= require("express-validator");
const {deleteFile} = require("../helpers/file");

/* GET */
exports.getAddProduct = (req, res, next) => {
    res.render("./admin/edit-product",{
        pageTitle : "Add Product", path : "/admin/add-product", editing : false, hasError : false, errorMessage : null, validationErrors : []
    });
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
        res.render("./admin/edit-product",{
            pageTitle : "Edit Product", path : "/admin/edit-product", editing : editMode, product : product, hasError : false, errorMessage : null, validationErrors : []
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getProducts = (req, res, next) => {
    Product.find({userId : req.user._id})
    .then(products => {
        res.render("./admin/products", {
            prods : products, pageTitle : "Admin Products", path : "/admin/products"
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}



/* POST */
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if(!errors.isEmpty() || !image){
        if(image){
            deleteFile(image.path);
        }
        return res.status(422).render("./admin/edit-product",{
            pageTitle : "Add Product", 
            path : "/admin/add-product", 
            editing : false, 
            hasError : true,
            product : {
                title : title,
                price : price,
                description : description
            },
            errorMessage : errors.isEmpty() === true ? "Attached file is not a valid image" : errors.array()[0].msg,
            validationErrors : errors.isEmpty() === true ? [] : errors.array()
        });
    }

    //const imageUrl = image.path;
    const imageUrl = "/" + image.path;

    const product = new Product ({title: title, price : price, imageUrl : imageUrl, description : description, userId : req.user._id})
    product.save()
    .then(result => {
        console.log("Created product");
        res.redirect("/admin/products");
    })
    .catch(err => {
        deleteFile(image.path);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImage = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        if(updatedImage){
            deleteFile(updatedImage.path);
        }
        return res.status(422).render("./admin/edit-product",{
            pageTitle : "Edit Product", 
            path : "/admin/edit-product", 
            editing : true, 
            hasError : true,
            product : {
                title : updatedTitle,
                price : updatedPrice,
                description : updatedDescription,
                _id : prodId
            },
            errorMessage : errors.array()[0].msg,
            validationErrors : errors.array()
        });
    }


    Product.findById({_id : prodId})
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect("/");
        }

        product.title = updatedTitle; 
        product.price = updatedPrice;
        if(updatedImage){
            const imagePath = product.imageUrl.substring(1); //Le quito el path absoluto y le doy el relativo.
            deleteFile(imagePath);
            product.imageUrl = "/" + updatedImage.path;
            //product.imageUrl = updatedImage.path; -> Si subimos a Linux descomentar
            //product.imageUrl = updatedImage.path.replace('\\', '/'); // -> Mientras desarrolle en Windows.
        }
        product.description = updatedDescription;

        return product.save()
        .then(result => {
            console.log("Product updated"); 
            res.redirect("/admin/products");
        })
    })
    .catch(err => {
        deleteFile(updatedImage.path);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.deleteProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product){
            return next(new Error("Product not found"));
        }
        const imagePath = product.imageUrl.substring(1); //Le quito el path absoluto y le doy el relativo.
        deleteFile(imagePath);
        return Product.deleteOne({_id : prodId, userId : req.user._id})
    })
    .then(result => {
        console.log("Destroy product")
        // res.redirect("/admin/products")
        res.status(200).json({message : "Success"})
    })
    .catch(err => {
        res.status(500).json({message : "Deleting product failed"})
    });
}