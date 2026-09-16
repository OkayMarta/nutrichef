const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");
const prisma = require("../lib/prisma");
const { sendPasswordResetEmail } = require("../services/emailService");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Generate a signed JWT for a given user ID.
 */
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ userId }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

/**
 * Strips passwordHash and returns public user fields.
 */
const sanitizeUser = (user) => {
    if (!user) return null;
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password must be strings",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Invalid email format",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists",
            });
        }

        // Hash password with bcrypt (salt rounds: 10)
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                email: normalizedEmail,
                passwordHash,
            },
        });

        const token = generateToken(newUser.id);

        return res.status(201).json({
            token,
            user: sanitizeUser(newUser),
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "An error occurred during registration",
            error: error.message,
        });
    }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                message: "Email and password must be strings",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            return res.status(401).json({
                message: "No account found with this email",
            });
        }

        // Compare password against stored passwordHash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Incorrect password. Please try again.",
            });
        }

        const token = generateToken(user.id);

        return res.status(200).json({
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "An error occurred during login",
            error: error.message,
        });
    }
};

/**
 * POST /api/auth/google
 */
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                message: "Google credential token is required",
            });
        }

        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(googleClientId);

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: googleClientId,
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
            return res.status(401).json({
                message: "Invalid or expired Google token",
                error: verifyError.message,
            });
        }

        if (!payload || !payload.email) {
            return res.status(400).json({
                message:
                    "Google token payload does not contain an email address",
            });
        }

        const normalizedEmail = payload.email.trim().toLowerCase();

        // Look up user by email
        let user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            // User doesn't exist; create a new record with a secure random hashed password
            const randomPassword = crypto.randomBytes(32).toString("hex");
            const passwordHash = await bcrypt.hash(randomPassword, 10);

            user = await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    passwordHash,
                },
            });
        }

        const sessionToken = generateToken(user.id);

        return res.status(200).json({
            token: sessionToken,
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Google auth error:", error);
        return res.status(500).json({
            message: "An error occurred during Google authentication",
            error: error.message,
        });
    }
};

/**
 * GET /api/auth/me (Protected route)
 */
const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({
            message: "An error occurred while fetching user profile",
            error: error.message,
        });
    }
};

/**
 * PUT /api/auth/goals (Protected route)
 * Updates the authenticated user's daily nutritional goals.
 */
const updateGoals = async (req, res) => {
    try {
        const { goalCalories, goalProtein, goalFat, goalCarbs } = req.body;

        // Validate all four fields are present
        if (
            goalCalories === undefined ||
            goalProtein === undefined ||
            goalFat === undefined ||
            goalCarbs === undefined
        ) {
            return res.status(400).json({
                message:
                    "All goal fields are required: goalCalories, goalProtein, goalFat, goalCarbs",
            });
        }

        // Parse and validate as positive integers
        const parsed = {
            goalCalories: parseInt(goalCalories, 10),
            goalProtein: parseInt(goalProtein, 10),
            goalFat: parseInt(goalFat, 10),
            goalCarbs: parseInt(goalCarbs, 10),
        };

        for (const [field, value] of Object.entries(parsed)) {
            if (isNaN(value) || value <= 0) {
                return res.status(400).json({
                    message: `${field} must be a positive number`,
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: parsed,
        });

        return res.status(200).json({
            user: sanitizeUser(updatedUser),
        });
    } catch (error) {
        console.error("Update goals error:", error);
        return res.status(500).json({
            message: "An error occurred while updating nutritional goals",
            error: error.message,
        });
    }
};

/**
 * PUT /api/auth/profile (Protected route)
 * Updates the authenticated user's profile (name).
 */
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (name !== undefined && name !== null) {
            if (typeof name !== "string") {
                return res.status(400).json({
                    message: "Name must be a string",
                });
            }

            const trimmedName = name.trim();
            if (trimmedName.length > 100) {
                return res.status(400).json({
                    message: "Name must be at most 100 characters",
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id: req.userId },
                data: { name: trimmedName || null },
            });

            return res.status(200).json({
                user: sanitizeUser(updatedUser),
            });
        }

        return res.status(400).json({
            message: "No valid fields to update",
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "An error occurred while updating profile",
            error: error.message,
        });
    }
};

/**
 * Multer configuration for avatar uploads.
 * Stores files in server/uploads/avatars/ with unique filenames.
 */
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../uploads/avatars");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${req.userId}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
                ),
                false,
            );
        }
    },
});

/**
 * POST /api/auth/avatar (Protected route)
 * Uploads and sets user avatar image.
 */
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided",
            });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { avatarUrl },
        });

        return res.status(200).json({
            user: sanitizeUser(updatedUser),
        });
    } catch (error) {
        console.error("Upload avatar error:", error);
        return res.status(500).json({
            message: "An error occurred while uploading avatar",
            error: error.message,
        });
    }
};

/**
 * POST /api/auth/forgot-password
 * Initiates password reset by sending a reset link to the user's email.
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                message: "Please enter your email address",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
            });
        }

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email",
            });
        }

        // Generate unhashed 32-byte crypto token
        const rawToken = crypto.randomBytes(32).toString("hex");

        // Hash token with SHA-256 for secure DB storage
        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        // 1 hour expiry
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: expires,
            },
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

        try {
            await sendPasswordResetEmail({
                to: user.email,
                resetUrl,
            });
        } catch (mailError) {
            console.error("Failed to send reset email:", mailError);
            // Roll back token if email dispatch fails
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
            });
            return res.status(500).json({
                message:
                    "Failed to send password reset email. Please try again later.",
            });
        }

        return res.status(200).json({
            message: "Password reset link has been sent to your email.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            message: "An error occurred while processing your request",
            error: error.message,
        });
    }
};

/**
 * POST /api/auth/reset-password
 * Resets user password using a valid, non-expired token.
 */
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                message: "Reset token is required",
            });
        }

        if (!password || typeof password !== "string") {
            return res.status(400).json({
                message: "New password is required",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
            });
        }

        if (!/\d/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one number",
            });
        }

        if (!(/[a-z]/.test(password) && /[A-Z]/.test(password))) {
            return res.status(400).json({
                message:
                    "Password must contain both uppercase and lowercase letters",
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character",
            });
        }

        // Hash incoming token to match stored SHA-256 hash
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid or expired password reset link. Please request a new one.",
            });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 10);

        // Update password and clear reset token fields
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        return res.status(200).json({
            message:
                "Password successfully reset. You can now log in with your new password.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            message: "An error occurred while resetting password",
            error: error.message,
        });
    }
};

module.exports = {
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
};
