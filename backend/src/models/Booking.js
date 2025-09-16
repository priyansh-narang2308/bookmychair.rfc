const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chairId: {
      type: String,
      required: true,
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
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
