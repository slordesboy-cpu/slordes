const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// kanal mesajlarını getir (basit, sayfalama yok)
router.get("/:channel", async (req, res) => {
  try {
    const channel = req.params.channel;
    const messages = await Message.find({ channel }).sort({ createdAt: 1 }).limit(200);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
