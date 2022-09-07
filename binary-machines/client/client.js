const axios = require("axios");
const { io } = require("socket.io-client");

const url = "http://localhost:3000";
const id = Math.ceil(Math.random() * 1000000)

axios
  .get(`${url}/user?id=${id}`)
  .then((res) => {
    console.log(res.data);
    const { token } = res.data;
    const socket = io(url, { query: { token: token } });
    socket.on("connect", () => {
      console.log("Socket is connected");
      socket.on("data", (books) => {
        console.log(books);
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket is disconnected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
