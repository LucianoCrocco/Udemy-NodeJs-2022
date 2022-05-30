const express = require("express");

const app = express();

/*
app.use((req, res, next) => {
    console.log("Primer Middleware - Parte 2 de la tarea");
    next();
});

app.use((req, res, next) => {
    console.log("Segundo Middleware - Parte 2 de la tarea");
    res.send("<h1>Parte 2 del ejercicio</h1>");
});*/

app.use("/users", (req, res, next) => {
    res.send("<h1>Users</h1>");
});

app.use("/", (req, res, next) => {
    res.send("<h1>Home</h1>");
});

app.listen(3000);