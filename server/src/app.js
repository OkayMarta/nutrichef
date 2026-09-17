const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const dailyLogRoutes = require("./routes/dailyLogRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// HTTP Security Headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
];
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl, server-to-server tests)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS: Request origin not allowed"));
            }
        },
        credentials: true,
    }),
);

// Body parsing with strict size limit to prevent memory DoS
app.use(express.json({ limit: "50kb" }));

// General API rate limiter
app.use("/api", apiLimiter);

// Serve static uploads with nosniff and no dotfiles
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"), {
        dotfiles: "ignore",
        setHeaders: (res) => {
            res.set("X-Content-Type-Options", "nosniff");
        },
    }),
);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/logs", dailyLogRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Catch-all 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Central error-handling middleware (masks internal details in production)
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    const isProd = process.env.NODE_ENV === "production";
    const status = err.status || 500;
    res.status(status).json({
        message:
            isProd && status === 500
                ? "Internal Server Error"
                : err.message || "Internal Server Error",
        ...(!isProd && { stack: err.stack }),
    });
});

module.exports = app;
