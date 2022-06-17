const fs = require("fs");
const path = require("path");
const pathProject = require("../helpers/path");

const pathCartJSON = path.join(pathProject, "data", "cart.json");

module.exports = class Cart{
    static addProduct (id, productPrice) {
        //Fetch previous Cart
        fs.readFile(pathCartJSON, (err, fileContent) => {
            let cart = {products : [], totalPrice : 0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex((p) => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            // Add new product/increase quantity
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct}
                updatedProduct.qty = updatedProduct.qty + 1;
                //cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty : 1};
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + Number.parseInt(productPrice);
            // Save the cart updated
            fs.writeFile(pathCartJSON, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }
    static deleteProduct = (id, productPrice) => {
        fs.readFile(pathCartJSON, (err, fileContent) => {
            if(err){
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product){
                return;
            }
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * product.qty);
            fs.writeFile(pathCartJSON, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            })
        })
    }
    static getCart = (cb) => {
        fs.readFile(pathCartJSON, (err, fileContent) => { 
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null);
            } else {
                cb(cart);
            }
        })
    }
}