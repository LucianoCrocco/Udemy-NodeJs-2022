const express = require("express");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const mongoose = require("mongoose");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({"extended" : true}));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("62b91f880c118ec5ff2aa4d6")
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);

mongoose.connect("")
.then(connection => {
    /*const user = new User({
        name : "Luciano",
        email : "luciano@mail.com",
        cart : {
            items : []
        }
    })
    user.save()
    O
    User.findOne()
    .then(user => {
        if(!user){
            const user = new User({
                name : "Luciano",
                email : "luciano@mail.com",
                cart : {
                    items : []
                }
            })
            user.save()
        }
    })
    */
    app.listen(3000);
})
.catch(err => console.log(err))