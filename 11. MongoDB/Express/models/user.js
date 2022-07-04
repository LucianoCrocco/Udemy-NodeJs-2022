const { getDb } = require("../helpers/database");
const { ObjectId } = require("mongodb");

class User {
    constructor(name, email, cart, id){
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection("users").insertOne(this)
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }

    addToCart(product){
        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({productId : new ObjectId(product._id), quantity : newQuantity});
        }

        const updatedCart = {items : updatedCartItems};
        const db = getDb();
        return db.collection("users").updateOne({_id : new ObjectId(this._id)},{
            $set : {
                cart : updatedCart
            }
        })
    }

    deleteItemFromCart(prodId){
        const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== prodId.toString());
        const db = getDb();
        return db.collection("users").updateOne({_id : new ObjectId(this._id)},{
            $set : {
                cart : {items : updatedCartItems}
            }
        })
    }

    addOrder(){
        const db = getDb();
        return this.getCart()
        .then(products => {
            const order = {
                items : products,
                user : {
                    _id : new ObjectId(this._id),
                    name : this.name,
                    email : this.email
                }
            }
            return db.collection("orders").insertOne(order)
        })
        .then(result => {
            this.cart = {items : []};
            return db.collection("users").updateOne({_id : new ObjectId(this._id)},{
                $set : {
                    cart : this.cart
                }
            })
        })
        .catch(err => console.log(err));
    }

    getOrders(){
        const db = getDb();
        return db.collection("orders").find({'user._id' : new ObjectId(this._id)}).toArray();
    }
    
    getCart(){
        const db = getDb();
        const productsIds = this.cart.items.map(i => i.productId)
        return db.collection("products")
        .find({_id : {$in : productsIds}}).toArray()
        .then(products => {
            return products.map(p => {
                return {...p, quantity : this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString();
                }).quantity}
            })
        })
        .catch(err => console.log(err))
    }

    static findById(userId){
        const db = getDb();
        return db.collection("users")
        .findOne({_id : ObjectId(userId)})
        .then(user => user)
        .catch(err => console.log(err));
    }
}

module.exports = User;