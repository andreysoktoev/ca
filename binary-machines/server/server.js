require("dotenv").config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bookSchema = new mongoose.Schema(
  {
    author: String,
    title: String,
  },
  {
    versionKey: false,
  }
);
const Book = mongoose.model("Book", bookSchema);

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.SECRET,
      (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  Book.find({}, (err, books) => {
    socket.emit('data', books)
  });
});

app.get("/user", (req, res) => {
  const { id } = req.query;
  const user = { id: id };
  const token = jwt.sign(user, process.env.SECRET, { expiresIn: "1h" });
  res.json({
    id: id,
    token: token,
  });
});

httpServer.listen(3000);
