const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

// Only admin can access analytics
const requireAdmin = requireRole("admin");

router.get(
  "/analytics/popular-chairs",
  verifyToken,
  requireAdmin,
  analyticsController.getPopularChairs
);
router.get(
  "/analytics/peak-hours",
  verifyToken,
  requireAdmin,
  analyticsController.getPeakHours
);

module.exports = router;
