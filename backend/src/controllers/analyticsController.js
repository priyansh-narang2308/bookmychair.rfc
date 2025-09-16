const Booking = require("../models/Booking");

// GET /analytics/popular-chairs
// Returns: [{ type: 'Ergonomic', bookings: 98 }, ...]
exports.getPopularChairs = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: "$chairType",
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          bookings: 1,
          _id: 0,
        },
      },
      {
        $sort: { bookings: -1 },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular chairs" });
  }
};

// GET /analytics/peak-hours
// Returns: [{ hour: '9:00 AM', bookings: 23 }, ...]
exports.getPeakHours = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: { $hour: { $toDate: "$date" } },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          hour: "$_id",
          bookings: 1,
          _id: 0,
        },
      },
      {
        $sort: { hour: 1 },
      },
    ]);
    // Format hour to AM/PM
    const formatted = result.map((r) => ({
      hour: `${r.hour % 12 === 0 ? 12 : r.hour % 12}:00 ${
        r.hour < 12 ? "AM" : "PM"
      }`,
      bookings: r.bookings,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch peak hours" });
  }
};
