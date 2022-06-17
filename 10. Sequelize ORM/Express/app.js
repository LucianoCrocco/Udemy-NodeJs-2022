const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");
const sequelize = require("./helpers/database");
const app = express();

const User = require("./models/user");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({"extended" : true}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);

Product.belongsTo(User, {
    constraints : true,
    onDelete : "CASCADE"
});
User.hasMany(Product);
User.hasOne(Cart);
//Cart.belongsTo(User); -> Este tipo de relacion o User.hasOne(Cart); que esta mas arriba
Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart, {through : CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through : OrderItem});

//sequelize.sync({force : true})
sequelize.sync()
.then(result => {
    //console.log(result)
    return User.findByPk(1)
})
.then(user => {
    if(!user){
        return User.create({
            name : 'Max',
            email : "Max@mail.com"
        })
    }
    return user;
})
.then(user => {
    user.getCart()
    .then(cart => {
        if(!cart){
            return user.createCart();
        }
        return user.getCart()
    })
})
.then(cart => {
    app.listen(3000);
})
.catch(err => console.log(err));
