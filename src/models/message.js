const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  user: { type: Schema.ObjectId, required: true, ref: "User" },
  content: { type: String, required: true },
  date: { type: Number, required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
