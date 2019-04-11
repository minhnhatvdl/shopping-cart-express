const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();

// mongoose
const mongoose = require("mongoose");
// get database from mlab
const { database } = require("./config/database");

// middleware body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// middleware express session
const session = require("express-session");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// middleware express-messages
const connectFlash = require("connect-flash");
const expressMessages = require("express-messages");
app.use(connectFlash());
app.use(function(req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// connect to server mlab
mongoose.connect(database, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to server");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const pagesRouter = require("./routes/pages");
const adminPagesRouter = require("./routes/admin-pages");
const adminCategoriesRouter = require("./routes/admin-categories");
const adminProductsRouter = require("./routes/admin-products");

app.use("/", pagesRouter);
app.use("/admin", adminPagesRouter);
app.use("/admin-categories", adminCategoriesRouter);
app.use("/admin-products", adminProductsRouter);

// set global error 
app.locals.errors = null;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
