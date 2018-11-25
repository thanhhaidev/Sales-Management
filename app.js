const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//require routes
const userRoutes = require("./api/routes/user");
const categoryRoutes = require("./api/routes/category");
const productRoutes = require("./api/routes/product");

// config database
mongoose.connect(process.env.DBURI, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;
app.use(morgan("dev"));
app.use('/upload/avatars', express.static("upload/avatars"));
app.use('/upload/products', express.static("upload/products"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//middleware header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});

//Config Routes
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: error.message
  });
});

module.exports = app;