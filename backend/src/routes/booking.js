const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

// Employee books a chair
router.post(
  "/bookings",
  verifyToken,
  requireRole("employee"),
  bookingController.bookChair
);

// Employee gets own bookings
router.get(
  "/bookings/me",
  verifyToken,
  requireRole("employee"),
  bookingController.getMyBookings
);

// Admin views all bookings
router.get(
  "/bookings",
  verifyToken,
  requireRole("admin"),
  bookingController.getAllBookings
);

// Cancel booking (employee or admin)
router.put(
  "/bookings/:id/cancel",
  verifyToken,
  bookingController.cancelBooking
);

module.exports = router;
