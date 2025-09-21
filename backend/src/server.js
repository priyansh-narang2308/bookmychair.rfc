const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://bookmychair.onrender.com", 
    credentials: true,
  },
});
app.set("io", io);


app.use(
  cors({
    origin: "https://bookmychair.onrender.com",
    credentials: true,
  })
);
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


const bookingRoutes = require("./routes/booking");
app.use("/api", bookingRoutes);


const chairRoutes = require("./routes/chair");
app.use("/api", chairRoutes);

// Analytics routes
const analyticsRoutes = require("./routes/analytics");
app.use("/api", analyticsRoutes);

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Socket.io
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// Cron job to ping health endpoint
cron.schedule("*/10 * * * *", async () => {
  try {
    await axios.get("https://bookmychair.onrender.com/api/health");
    console.log("Pinged health endpoint to keep server awake");
  } catch (err) {
    console.error("Failed to ping health endpoint:", err.message);
  }
});

// Serve React frontend
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

// This will catch all frontend routes and serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
