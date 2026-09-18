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
 * Safe error response helper: masks internal server error messages in production.
 */
const safeError = (res, status, message, error) => {
    console.error(message, error);
    return res.status(status).json({
        message,
        ...(process.env.NODE_ENV !== "production" && { error: error?.message }),
    });
};

/**
 * Generate a signed JWT for a given user ID.
 */
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ userId }, secret, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

/**
 * Strips passwordHash and reset tokens, returning only public user fields.
 */
const sanitizeUser = (user) => {
    if (!user) return null;
    const {
        passwordHash,
        resetPasswordToken,
        resetPasswordExpires,
        ...userWithoutSensitiveData
    } = user;
    return userWithoutSensitiveData;
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
        return safeError(
            res,
            500,
            "An error occurred during registration",
            error,
        );
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
        return safeError(res, 500, "An error occurred during login", error);
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
            // Check if token is an OAuth2 access token
            try {
                const userInfoRes = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                if (userInfoRes.ok) {
                    payload = await userInfoRes.json();
                } else {
                    const tokenInfoRes = await fetch(
                        `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(token)}`,
                    );
                    if (tokenInfoRes.ok) {
                        payload = await tokenInfoRes.json();
                    } else {
                        throw new Error(
                            `Google token verification failed (userinfo status: ${userInfoRes.status}, tokeninfo status: ${tokenInfoRes.status})`,
                        );
                    }
                }
            } catch (fallbackError) {
                console.error("Google auth token verification failed:", {
                    verifyError: verifyError.message,
                    fallbackError: fallbackError.message,
                });
                return res.status(401).json({
                    message: "Invalid or expired Google token",
                    error: fallbackError.message || verifyError.message,
                });
            }
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
                    name: payload.name || null,
                    avatarUrl: payload.picture || null,
                },
            });
        }

        const sessionToken = generateToken(user.id);

        return res.status(200).json({
            token: sessionToken,
            user: sanitizeUser(user),
        });
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred during Google authentication",
            error,
        );
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
        return safeError(
            res,
            500,
            "An error occurred while fetching user profile",
            error,
        );
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
        return safeError(
            res,
            500,
            "An error occurred while updating nutritional goals",
            error,
        );
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
        return safeError(
            res,
            500,
            "An error occurred while updating profile",
            error,
        );
    }
};

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_MIME_EXTENSIONS = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "image/webp": [".webp"],
};

/**
 * Validates image header magic bytes from the uploaded file on disk.
 * Supports JPEG, PNG, GIF, and WebP (RIFF...WEBP).
 */
const isValidImageMagicBytes = async (filePath) => {
    try {
        const handle = await fs.promises.open(filePath, "r");
        try {
            const buffer = Buffer.alloc(12);
            const { bytesRead } = await handle.read(buffer, 0, 12, 0);
            if (bytesRead < 4) return false;

            // JPEG: FF D8 FF
            if (
                buffer[0] === 0xff &&
                buffer[1] === 0xd8 &&
                buffer[2] === 0xff
            ) {
                return true;
            }
            // PNG: 89 50 4E 47
            if (
                buffer[0] === 0x89 &&
                buffer[1] === 0x50 &&
                buffer[2] === 0x4e &&
                buffer[3] === 0x47
            ) {
                return true;
            }
            // GIF: 47 49 46 38 ('GIF8')
            if (
                buffer[0] === 0x47 &&
                buffer[1] === 0x49 &&
                buffer[2] === 0x46 &&
                buffer[3] === 0x38
            ) {
                return true;
            }
            // WebP: 52 49 46 46 ('RIFF') ... 57 45 42 50 ('WEBP')
            if (
                bytesRead >= 12 &&
                buffer[0] === 0x52 &&
                buffer[1] === 0x49 &&
                buffer[2] === 0x46 &&
                buffer[3] === 0x46 &&
                buffer[8] === 0x57 &&
                buffer[9] === 0x45 &&
                buffer[10] === 0x42 &&
                buffer[11] === 0x50
            ) {
                return true;
            }

            return false;
        } finally {
            await handle.close();
        }
    } catch {
        return false;
    }
};

/**
 * Multer configuration for avatar uploads.
 * Stores files in server/uploads/avatars/ with unique sanitized filenames.
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
        let ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.has(ext)) {
            const validExts = ALLOWED_MIME_EXTENSIONS[file.mimetype];
            ext = validExts ? validExts[0] : ".png";
        }
        const uniqueName = `${req.userId}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (
            ALLOWED_MIME_EXTENSIONS[file.mimetype] &&
            ALLOWED_EXTENSIONS.has(ext)
        ) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
                ),
                false,
            );
        }
    },
});

/**
 * POST /api/auth/avatar (Protected route)
 * Uploads and sets user avatar image with magic byte verification and old avatar cleanup.
 */
const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided",
            });
        }

        // Verify image signature / magic bytes to prevent polyglot or disguised file execution
        const isValid = await isValidImageMagicBytes(req.file.path);
        if (!isValid) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch {
                // Ignore cleanup error
            }
            return res.status(400).json({
                message: "File contents do not match a valid image format.",
            });
        }

        // Fetch existing avatar to clean up old file from disk
        const existingUser = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { avatarUrl: true },
        });

        if (
            existingUser?.avatarUrl &&
            existingUser.avatarUrl.startsWith("/uploads/avatars/")
        ) {
            const oldFileName = path.basename(existingUser.avatarUrl);
            const oldFilePath = path.join(
                __dirname,
                "../../uploads/avatars",
                oldFileName,
            );
            if (fs.existsSync(oldFilePath)) {
                try {
                    await fs.promises.unlink(oldFilePath);
                } catch (unlinkErr) {
                    console.warn(
                        "Failed to delete old avatar file:",
                        unlinkErr.message,
                    );
                }
            }
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
        return safeError(
            res,
            500,
            "An error occurred while uploading avatar",
            error,
        );
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

        // Anti-user enumeration: Return identical 200 OK message even if email is not found
        if (!user) {
            return res.status(200).json({
                message:
                    "If an account with this email exists, a password reset link has been sent.",
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
            message:
                "If an account with this email exists, a password reset link has been sent.",
        });
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while processing your request",
            error,
        );
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
        return safeError(
            res,
            500,
            "An error occurred while resetting password",
            error,
        );
    }
};

/**
 * DELETE /api/auth/account (Protected route)
 * Permanently deletes user account, all associated data, and uploaded avatars.
 */
const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Clean up any uploaded avatar files from disk
        try {
            const uploadDir = path.join(__dirname, "../../uploads/avatars");
            if (fs.existsSync(uploadDir)) {
                const files = await fs.promises.readdir(uploadDir);
                const userFiles = files.filter(
                    (file) =>
                        file.startsWith(`${userId}-`) ||
                        (user.avatarUrl &&
                            user.avatarUrl.startsWith("/uploads/avatars/") &&
                            file === path.basename(user.avatarUrl)),
                );

                for (const file of userFiles) {
                    try {
                        await fs.promises.unlink(path.join(uploadDir, file));
                    } catch (unlinkErr) {
                        console.warn(
                            `Failed to remove avatar file ${file}:`,
                            unlinkErr.message,
                        );
                    }
                }
            }
        } catch (fileCleanErr) {
            console.warn(
                "Error scanning avatar directory during account deletion:",
                fileCleanErr.message,
            );
        }

        // Delete user from DB (PostgreSQL / Prisma cascade removes Meals and DailyLogs)
        await prisma.user.delete({
            where: { id: userId },
        });

        return res.status(200).json({
            message:
                "Account and all associated data have been permanently deleted.",
        });
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while deleting account",
            error,
        );
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
    deleteAccount,
};
