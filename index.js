require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/users");
const userAuthRouter = require("./src/routes/userAuth");
const productRouter = require("./src/routes/products");
const categoryRouter = require("./src/routes/categories");
const morgan = require("morgan");
const port = process.env.DB_PORT || 3500;
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
const optionCors = { credentials: true, origin:`${process.env.FRONT_URL}` };
app.use(cors(optionCors));
app.use(cookieParser());

app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/", userAuthRouter);
app.use("/files", express.static("./uploads"));

app.use("*", (req, res, next) => {
  const error = new createError.NotFound();
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "internal server Error",
  });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
