const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = "degistir-burayi-guvenli-bir-sey-ile"; // production -> env var

// register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Eksik alan" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: "Kullanıcı adı mevcut" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash: hash });
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Hatalı kullanıcı/şifre" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Hatalı kullanıcı/şifre" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
