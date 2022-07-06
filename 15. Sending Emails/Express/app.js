//Modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStoreSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
require("dotenv").config();

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
const MONGODB_URI = process.env.MONGODB_URI;

//Inicialization
const app = express();
const store = mongoDBStoreSession({uri : MONGODB_URI, collection : "sessions"});
const csrfProtecction = csrf();

//Template engines
app.set("view engine", "ejs");
app.set("views", "./views");

//Middlwares  
app.use(express.urlencoded({"extended" : true})); //-> JSON format for files and forms 
app.use(express.static(path.join(rootDir, "public"))); // -> Usage of static
app.use(session({secret : process.env.SECRET_SESSION, resave : false, saveUninitialized : false, store : store}));//-> Session
app.use(csrfProtecction);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

//Temporary Middleware for User
app.use((req, res, next) => {
    if(!req.session.user){
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
    app.listen(3000);
})
.catch(err => console.log(err))