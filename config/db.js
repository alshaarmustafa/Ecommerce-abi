// DB connection 
const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then((conn) => {
    //conn.connection.host بيعطيك عنوان السيرفر الحقيقي
    const host = conn.connection.host;
    const dbName = conn.connection.name;

    console.log(`✅ MongoDB Connected to DB: ${dbName}`);
    
    // فحص بسيط عشان تعرف أنت وين متصل فعلياً
    if (host.includes('mongodb.net')) {
      console.log(`🌐 Remote Host: Atlas (Cloud)`);
    } else {
      console.log(`💻 Remote Host: Localhost`);
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
