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

  const userId = socket.handshake.query.userId;
  socket.join(userId);

  socket.on("disconnect", () => {
    socket.leave(userId);
  });

  socket.on("joinRequest", async (roomId) => {
    socket.join(roomId);
  });

  socket.on("leaveRequest", async (roomId) => {
    socket.leave(roomId);
  });

  socket.on("message", async (content, roomId, userId) => {
    console.log(content);
    const user = await User.findById(userId);
    const newMessage = await new Message({
      user: user.id,
      content: content,
      date: new Date().getTime(),
    }).populate("user");
    const room = await Room.findById(roomId).find({
      messages: { $exists: true, $ne: [] },
    });
    await Room.updateOne({ _id: roomId }, { $push: { messages: newMessage } });
    if (room.length > 0) {
      // We're sending the message for the first time, so notify users to refetch chats
      for (let i = 0; i < room[0].roomUsers.length; i++) {
        const roomUser = room[0].roomUsers[i];
        io.in(roomUser).emit("refetchChats");
      }
    }
    io.in(roomId).emit("message", newMessage);
  });

  socket.on("typing", async (roomId, userId) => {
    const { username } = await User.findById(userId);
    socket.to(roomId).emit("typing", username);
  });
});

// Starting the server
server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
