const userRoutes = require("./routes/userRoutes");
const quizHistoryRoutes = require("./routes/quizHistoryRoutes");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/quiz", quizHistoryRoutes);

const PORT = process.env.PORT || 5000;
const SERVER_URL = `https://online-practice-test-platform-reactapp.onrender.com`;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Self-ping every 3 minutes (180,000 ms)
  setInterval(async () => {
    try {
      console.log("Pinging server to keep it alive...");
      await axios.get(`${SERVER_URL}/`);
      console.log("Server pinged successfully.");
    } catch (err) {
      console.error("Error pinging server:", err.message);
    }
  }, 180000); // 3 minutes
});
