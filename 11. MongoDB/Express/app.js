const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const { mongoConnect } = require("./helpers/database");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({"extended" : true}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("62af8e70d9c05b2468d9b432")
    .then(user => {
        req.user =  new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000)
})
