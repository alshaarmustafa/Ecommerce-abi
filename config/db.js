//DB connection 
const mongoose = require("mongoose");
require('dotenv').config()
const url =process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => {
    console.log(
      "✅ MongoDB Local Connected to DB:",
      mongoose.connection.db.databaseName
    );
  })
  // .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
