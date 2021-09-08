require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/users");
const userAuthRouter = require("./src/routes/userAuth");
const productRouter = require("./src/routes/products");
const categoryRouter = require("./src/routes/categories");
const orderRouter = require("./src/routes/orders");
const morgan = require("morgan");
const port = process.env.DB_PORT || 3500;
const cors = require("cors");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const http = require("http").createServer(app);

// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
const optionCors = { credentials: true, origin:`${process.env.FRONT_URL}` };
app.use(cors(optionCors));
app.use(cookieParser());

app.use("/orders", orderRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/", userAuthRouter);
app.use("/files", express.static("./uploads"));

// creating socket io instance
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name == "TokenExpiredError")
        return res.status(403).send({ message: "Token expired" });
      if (err.name == "JsonWebTokenError")
        return res.status(403).send({ message: err.message });
      if (err.name == "NotBeforeError")
        return res.status(403).send({ message: "Token not active" });
    }

    socket.id = decoded.id;
    socket.join(decoded.id);

    next();
  });
});

io.on("connection", function (socket) {
  console.log("User connected", socket.id);

  // attach incoming listener for new user
  socket.on("userConnected", function (userId) {
    // save in array
    users[userId] = socket.id;

    // socket id will be used to send message to individual person
    // notify all connected clients
    io.emit("userConnected", userId);
  });

  socket.on("sendMessage", (data, callback) => {
    const dataMessage = {
      id: uuid().split("-").join(""),
      sender: socket.userId,
      receiver: data.receiver,
      message: data.message,
      createdAt: new Date(),
    };
    callback({
      ...dataMessage,
      createdAt: moment(dataMessage.createdAt).format("LT"),
    });
    // modelChats.insertChat(dataMessage).then(() => {
    //   socket.broadcast.to(dataMessage.receiver).emit("newMessage", {
    //     ...dataMessage,
    //     createdAt: moment(dataMessage.created_at).format("LT"),
    //   });
    // });
  });

  socket.on("disconnect", () => {
    console.log("Client terputus", socket.id);
  });
});

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

http.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
