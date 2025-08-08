const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  channel: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
