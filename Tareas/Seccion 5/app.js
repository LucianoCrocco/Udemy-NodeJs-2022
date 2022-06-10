const express = require("express");
const formRoutes = require("./routes/formUser");
const usrRouter = require("./routes/userList");

const app = express();

app.use(express.urlencoded({"extended" : true}));


app.use("/",formRoutes.routes);
app.use("/", usrRouter)

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);