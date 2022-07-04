const {getDb} = require("../helpers/database");
const mongoDb = require("mongodb");


class Product {
    constructor(title, price, imageUrl, description, id, userId){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongoDb.ObjectId(id) : null;
        this.userId = userId
    }

    save() {
        const db = getDb();
        if(this._id){
            //Update product
            return db.collection('products').updateOne({ _id : this._id}, {$set : this})
            .then(result => console.log(result))
            .catch(err => console.log(err))
        } else {
            return db.collection('products').insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err));
        }
    }

    static fetchAll(){
        const db = getDb(); 
        return db.collection("products")
        .find({}).toArray()
        .then(products => {
            //console.log(products);
            return products;
        })  
        .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDb(); 
        return db.collection("products")
        .find({_id : new mongoDb.ObjectId(prodId)})
        .next()
        .then(product => {
            //console.log(product);
            return product;
        })
        .catch(err => console.log(err));
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection("products").deleteOne({_id : new mongoDb.ObjectId(prodId)})
        .then(result => console.log("deleted"))
        .catch(err => console.log(err))
        ;
    }
}

module.exports = Product;