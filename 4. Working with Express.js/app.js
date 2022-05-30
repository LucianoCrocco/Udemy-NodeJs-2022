const express = require("express");
const path = require("path");
const adminRoutes = require("./routes/admin")
const shopRouter = require("./routes/shop");

const app = express();

app.use(express.urlencoded({"extended" : true}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRouter);

app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not fund</h1>");
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
})

app.listen(3000);