const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected profile route
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You are authorized to access this profile",
        user: req.user
    });
});

module.exports = router;