const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
  content: { type: String, required: true },
});

module.exports = mongoose.model("Message", MessageSchema);
