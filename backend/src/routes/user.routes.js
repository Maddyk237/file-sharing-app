const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user.id } },
      { password: 0 }
    );
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
