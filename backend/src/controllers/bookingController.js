const Booking = require("../models/Booking");
const mongoose = require("mongoose");

exports.bookChair = async (req, res) => {
  try {
    const {
      chairId,
      chairName,
      chairType,
      chairLocation,
      chairFeatures,
      chairStatus,
      date,
      timeSlot,
    } = req.body;
    const userId = req.user.id;
    if (
      !chairId ||
      !chairName ||
      !chairType ||
      !chairLocation ||
      !chairFeatures ||
      !chairStatus ||
      !date ||
      !timeSlot
    ) {
      return res.status(400).json({ message: "All fields required." });
    }
    // Prevent double booking for same chair, date, and timeSlot
    const existing = await Booking.findOne({
      chairId,
      date,
      timeSlot,
      status: "confirmed",
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Chair is already booked for this time slot." });
    }
    const booking = new Booking({
      userId,
      chairId,
      chairName,
      chairType,
      chairLocation,
      chairFeatures,
      chairStatus,
      date,
      timeSlot,
      status: "confirmed",
    });
    await booking.save();
    res.status(201).json({ message: "Booking confirmed.", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled.", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
