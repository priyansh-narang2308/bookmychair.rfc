const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:8081",
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
