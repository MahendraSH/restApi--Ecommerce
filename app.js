const express = require("express");
const Products = require("./routers/productRouter");
const User = require("./routers/userRouter");
const Order = require("./routers/orderRouter");
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes//
// products
app.use('/api/v1',Products);
app.use('/api/v1',User);
app.use('/api/v1', Order);
//use middlewares for error handling
app.use(require('./middlewares/errorsControllers'))




 module.exports = app;