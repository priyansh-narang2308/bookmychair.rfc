const mongoose = require("mongoose");

const chairSchema = new mongoose.Schema(
  {
    chairId: {
      type: String,
      required: true,
      unique: true,
    },
    chairName: {
      type: String,
      required: true,
    },
    chairType: {
      type: String,
      required: true,
    },
    chairLocation: {
      type: String,
      required: true,
    },
    chairFeatures: {
      type: [String],
      required: true,
    },
    chairStatus: {
      type: String,
      enum: ["available", "booked", "maintenance", "blocked"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chair", chairSchema);
