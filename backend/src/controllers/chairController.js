const Chair = require("../models/Chair");

// Add a new chair (admin only)
exports.addChair = async (req, res) => {
  try {
    const chair = new Chair(req.body);
    await chair.save();
    // Emit real-time update
    req.app.get("io").emit("chairUpdated");
    res.status(201).json({ chair });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all chairs (optionally filter by type/status)
exports.getChairs = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.chairType = type;
    if (status) filter.chairStatus = status;
    const chairs = await Chair.find(filter);
    res.json({ chairs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Block a chair (admin only)
exports.blockChair = async (req, res) => {
  try {
    const chair = await Chair.findByIdAndUpdate(
      req.params.id,
      { chairStatus: "blocked" },
      { new: true }
    );
    if (!chair) return res.status(404).json({ error: "Chair not found" });
    // Emit real-time update
    req.app.get("io").emit("chairUpdated");
    res.json({ chair });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a chair (admin only)
exports.deleteChair = async (req, res) => {
  try {
    const chair = await Chair.findByIdAndDelete(req.params.id);
    if (!chair) return res.status(404).json({ error: "Chair not found" });
    // Emit real-time update
    req.app.get("io").emit("chairUpdated");
    res.json({ message: "Chair deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
