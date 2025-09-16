const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
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

// Middleware
app.use(
  cors({
    origin: "https://bookmychair.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

// Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend running" });
});

// Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Booking routes
const bookingRoutes = require("./routes/booking");
app.use("/api", bookingRoutes);

// Chair routes
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
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
