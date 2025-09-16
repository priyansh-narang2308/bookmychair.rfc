const express = require("express");
const router = express.Router();
const chairController = require("../controllers/chairController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");

// Helper middlewares
const requireAuth = verifyToken;
const requireAdmin = requireRole("admin");

// Add a new chair (admin only)
router.post("/chairs", requireAuth, requireAdmin, chairController.addChair);

// Get all chairs (all users)
router.get("/chairs", requireAuth, chairController.getChairs);

// Block a chair (admin only)
router.put(
  "/chairs/:id/block",
  requireAuth,
  requireAdmin,
  chairController.blockChair
);

// Delete a chair (admin only)
router.delete(
  "/chairs/:id",
  requireAuth,
  requireAdmin,
  chairController.deleteChair
);

// Make sure to use the correct API URL in frontend: `${import.meta.env.VITE_API_URL}/api/chairs`
// No changes needed in backend routes, they are correct.
// If you see /admin/undefined/api/chairs in frontend, fix your fetch URL in ChairManagement.tsx.

module.exports = router;
