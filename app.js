const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./data/db");
const authRoutes = require("./routes/auth");
const msgRoutes = require("./routes/messages");
const Message = require("./models/Message");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000", "http://127.0.0.1:5500"], methods: ["GET","POST"] }
});

connectDB(); // varsayılan localhost URI, istersen env ile değiştir

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", msgRoutes);

// basit health
app.get("/ping", (req, res) => res.send("pong"));

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("Socket bağlı:", socket.id);

  // kullanıcı belirli bir kanala katılıyor
  socket.on("joinChannel", (channel) => {
    socket.join(channel);
    console.log(`${socket.id} joined ${channel}`);
  });

  // mesaj gönder
  socket.on("sendMessage", async (payload) => {
    // payload { channel, username, content, userId }
    try {
      const msg = new Message({
        channel: payload.channel,
        username: payload.username,
        userId: payload.userId,
        content: payload.content
      });
      await msg.save();
      io.to(payload.channel).emit("newMessage", {
        _id: msg._id,
        channel: msg.channel,
        username: msg.username,
        content: msg.content,
        createdAt: msg.createdAt
      });
    } catch (err) {
      console.error("Mesaj kaydetme hatası:", err);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server çalışıyor: ${PORT}`));
