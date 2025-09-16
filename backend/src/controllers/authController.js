const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role required." });
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or role." });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
};
