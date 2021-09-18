const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const morgan = require("morgan");
const Message = require("./models/message");
const Room = require("./models/room");
const User = require("./models/user");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Db connection
require("./database");

// Settings
app.set("port", process.env.PORT || 80);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", require("./routes/messages.routes"));
app.use("*", require("./routes/app.routes"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", async (content, roomId, userId) => {
    const user = await User.findById(userId);
    const newMessage = await new Message({
      user: user.id,
      content: content,
      date: new Date().getTime(),
    }).populate("user");
    await Room.updateOne({ _id: roomId }, { $push: { messages: newMessage } });
    io.emit("message", newMessage);
  });
});

// Starting the server
server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
