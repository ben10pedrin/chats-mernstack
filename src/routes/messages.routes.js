const express = require("express");
const router = express.Router();

const Message = require("../models/message");
const User = require("../models/user");
const Room = require("../models/room");

router.get("/messages", async (req, res) => {
  const roomId = req.query.roomId;
  const room = await Room.findById(roomId).populate("messages.user");
  res.json(room.messages);
});

router.get("/test", async (req, res) => {
  user1 = await User.find({ username: "hello" });
  user2 = await User.find({ username: "adobe" });
  const newRoom = new Room({ roomUsers: [user1[0].id, user2[0].id] });
  newRoom.save();
  res.json({ status: "ok" });
});

router.get("/chats", async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findById(userId);

  // Populate roomUsers reference
  const rooms = await Room.find()
    .populate("roomUsers")
    .find({
      roomUsers: { _id: user.id },
      messages: { $exists: true, $ne: [] },
    });

  // Adding to array only users distinct to the username
  let chats = [];
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    for (let j = 0; j < room.roomUsers.length; j++) {
      const user = room.roomUsers[j];
      if (user.id !== userId) {
        chats.push({ roomName: user.username, roomId: room.id });
      }
    }
  }
  res.json(chats);
});

router.get("/user", async (req, res) => {
  const username = req.query.username;
  const user = await User.findOne({ username: username });
  let userId;

  if (user === null) {
    const newUser = new User({ username: username });
    await newUser.save();
    userId = newUser.id;
  } else {
    userId = user.id;
  }

  res.json({ userId: userId });
});

router.get("/contacts", async (req, res) => {
  const userId = req.query.userId;
  const contacts = await User.find({ _id: { $ne: userId } });
  res.json(contacts);
});

router.post("/room", async (req, res) => {
  const { arrayOfUsers } = req.body;
  const room = await Room.findOne({ roomUsers: { $all: arrayOfUsers } });
  let roomId;

  if (room !== null) {
    roomId = room.id;
  } else {
    const newRoom = new Room({ roomUsers: arrayOfUsers, messages: [] });
    await newRoom.save();
    roomId = newRoom.id;
  }
  res.json({ roomId });
});

module.exports = router;
