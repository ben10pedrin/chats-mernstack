const mongoose = require("mongoose");
const { Schema } = mongoose;
const Message = require("../models/message");

const RoomSchema = new Schema({
  roomName: { type: String, required: false },
  roomUsers: [{ type: Schema.ObjectId, required: true, ref: "User" }],
  messages: [{ type: Message.schema, required: false, default: [] }],
});

module.exports = mongoose.model("Room", RoomSchema);
