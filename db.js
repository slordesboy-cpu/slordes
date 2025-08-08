// data/db.js
const mongoose = require("mongoose");

const connectDB = async (uri = "mongodb://localhost:27017/discordklon") => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB bağlantısı başarılı");
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
