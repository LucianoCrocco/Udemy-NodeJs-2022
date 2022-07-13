//Modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStoreSession = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
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
const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './images');
    },
    filename : (req, file, cb) => {
        cb(null, new Date().getTime() + file.originalname);
        //cb(null, new Date().toISOString() + "-" + file.originalname); -> Windows doesn't like ':' in the path
    } 
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

//Inicialization
const app = express();
const store = mongoDBStoreSession({uri : MONGODB_URI, collection : "sessions"});
const csrfProtecction = csrf();

//Template engines
app.set("view engine", "ejs");
app.set("views", "./views");

//Middlwares  
app.use(express.urlencoded({"extended" : true})); //JSON format for files and forms. Parses enctype "application/x-www-form-urlencoded" forms
app.use(multer({storage : fileStorage, fileFilter : fileFilter}).single('image')); // Parses enctype "multipart/form-data" forms
app.use(express.static(path.join(rootDir, "public"))); //Usage of static files
app.use("/images", express.static(path.join(rootDir, "images"))); //Usage of static files 
app.use(session({secret : process.env.SECRET_SESSION, resave : false, saveUninitialized : false, store : store}));//Session
app.use(csrfProtecction); //CSRF protection in session
app.use(flash()); //Flash variables for requests

app.use((req, res, next) => { // Variables for every response
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => { //Middleware for User
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if(!user){
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err))
    });
})


//Registration of routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
//Default error
app.use("/500", errorController.get500);
app.use(errorController.get404);

//Error middleware
app.use((error, req, res, next) => {
    // res.redirect(`/${error.httpStatusCode}`);
    console.log(error);
    res.status(500).render("500", {pageTitle : "Server Side Error", path : "/500", isAuthenticated: req.session.isLoggedIn})
})

//Connection to Db and start server
mongoose.connect(MONGODB_URI)
.then(connection => {
    app.listen(3000);
})
.catch(err => console.log(err))