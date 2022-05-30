const express = require("express");
const path = require("path");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(indexRouter);
app.use(usersRouter);

app.listen(3000);