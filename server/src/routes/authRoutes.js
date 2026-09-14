const express = require("express");
const {
    register,
    login,
    googleAuth,
    getMe,
    updateGoals,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/goals", authMiddleware, updateGoals);

module.exports = router;
