const express = require("express");
const feedRoutes = require("./routes/feed");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const authRoutes = require("./routes/auth");
// const { Server } = require("socket.io");
const socketFile = require("./socket");


const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, /*uuidv4()*/ Date.now() + "-" + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null,true);
    } else {
        cb(null,false);
    }
}

multer.diskStorage({})

app.use(express.json());
app.use(multer({storage : fileStorage, fileFilter : fileFilter}).single("image"));
app.use("/images", express.static(path.join("images")));/*__dirname, */

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message : message,
        data : data
    })
})

mongoose.connect(MONGODB_URI)
.then(result => {
    const server = app.listen(8080);
    // const io = new Server(server, {
    //     cors: {
    //         origin: "http://localhost:3000",
    //         methods: ["GET", "POST"]
    //     }
    // })
    const io = socketFile.init(server);
    io.on("connection", socket => {
        console.log("Client Connected");
    })
})
.catch(err => console.log(err));

