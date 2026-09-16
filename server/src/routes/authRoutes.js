const express = require("express");
const {
    register,
    login,
    googleAuth,
    getMe,
    updateGoals,
    updateProfile,
    avatarUpload,
    uploadAvatar,
    forgotPassword,
    resetPassword,
    deleteAccount,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/goals", authMiddleware, updateGoals);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/account", authMiddleware, deleteAccount);
router.post(
    "/avatar",
    authMiddleware,
    (req, res, next) => {
        avatarUpload.single("avatar")(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    uploadAvatar,
);

module.exports = router;
