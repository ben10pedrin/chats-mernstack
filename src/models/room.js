const mongoose = require("mongoose");
const { Schema } = mongoose;
const Message = require("../models/message");

const RoomSchema = new Schema({
  roomUsers: [{ type: Schema.ObjectId, required: true, ref: "User" }],
  messages: [{ type: Message.schema, required: true }],
});

module.exports = mongoose.model("Room", RoomSchema);
