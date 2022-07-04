//Core Modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStoreSession = require("connect-mongodb-session")(session);

//Routes
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

//Controller
const errorController = require("./controllers/error");

//Models
const User = require("./models/user");

//helpers
const rootDir = require("./helpers/path"); //rootDir instead __dirname

//constants
const MONGODB_URI = "mongodb+srv://LucianoCrocco:guL5uFVZOKG17kq3@udemy-nodejs-cluster.8fshwnq.mongodb.net/shop?retryWrites=true&w=majority";

//App file
const app = express();
const store = mongoDBStoreSession({uri : MONGODB_URI, collection : "sessions"});

//Template engines
app.set("view engine", "ejs");
app.set("views", "./views");

//Middlwares  
app.use(express.urlencoded({"extended" : true})); //-> JSON format for files and forms 
app.use(express.static(path.join(rootDir, "public"))); // -> Usage of static
app.use(session({secret : 'my secret', resave : false, saveUninitialized : false, store : store}))//-> Session

//Temporary Middleware for User
app.use((req, res, next) => {
    if(!req.session.user._id){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})


//Registration of routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
//Default error
app.use(errorController.get404);

//Connection to Db and start server
mongoose.connect(MONGODB_URI)
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