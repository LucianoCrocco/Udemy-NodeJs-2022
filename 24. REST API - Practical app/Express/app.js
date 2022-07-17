const express = require("express");
const feedRoutes = require("./Routes/feed");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/feed", feedRoutes);

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(8080);
})
.catch(err => console.log(err));

