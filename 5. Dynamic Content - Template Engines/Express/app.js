const express = require("express");
const path = require("path");
//const {router, products} = require("./routes/admin") -> Otra forma de exportar 
const adminData = require("./routes/admin") 
const shopRoutes = require("./routes/shop");
const expressHbs = require("express-handlebars");

const app = express();

//app.engine("hbs", expressHbs({layoutsDir: ".views/layouts/", default: "main-layout"})); -> Le asignamos un motor que no esta incluido en express.

//app.set("view engine", "pug"); -> PUG
//app.set("view engine", "hbs");
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({"extended" : true}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {pageTitle : "Page Not Found", path : ""})
})

app.listen(3000);