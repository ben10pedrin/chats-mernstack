const express = require("express");
const router = express.Router();

const Message = require("../models/message");
const User = require("../models/user");
const Room = require("../models/room");

router.get("/user/:username", async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  let userId;

  if (user === null) {
    const newUser = new User({ username });
    await newUser.save();
    userId = newUser.id;
  } else {
    userId = user.id;
  }

  res.json(userId);
});

router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/rooms/:userId", async (req, res) => {
  const { userId } = req.params;
  let rooms = await Room.find({
    roomUsers: userId,
    messages: { $ne: [] },
  }).select("roomName roomUsers");

  rooms = await Promise.all(
    rooms.map(async (room) => {
      let roomName;
      if (room.roomName === undefined) {
        // If no roomName then it can't be a group, so is a 2 people chat
        let otherUserIndex;
        room.roomUsers[0].toString() === userId
          ? (otherUserIndex = 1)
          : (otherUserIndex = 0);
        const otherUser = await User.findById(room.roomUsers[otherUserIndex]);
        roomName = otherUser.username;
      } else {
        roomName = room.roomName;
      }

      return {
        roomName,
        roomId: room.id,
      };
    })
  );

  console.log(rooms);

  res.json(rooms);
});

router.post("/joinRoom", async (req, res) => {
  const arrayOfUsers = req.body;
  const room = await Room.findOne({ roomUsers: { $all: arrayOfUsers } });
  let roomId;

  if (room === null) {
    const newRoom = new Room({ roomUsers: arrayOfUsers });
    await newRoom.save();
    roomId = newRoom.id;
  } else {
    roomId = room.id;
  }

  res.json(roomId);
});

router.get("/messages/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findById(roomId).populate("messages.user");
  res.json(room.messages);
});

module.exports = router;
