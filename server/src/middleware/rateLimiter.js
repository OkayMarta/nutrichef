const rateLimit = require("express-rate-limit");

/**
 * Skip rate limiting in test environments to ensure test suites pass without throttling.
 */
const isTestEnv = () =>
    process.env.NODE_ENV === "test" ||
    process.argv.some((arg) => typeof arg === "string" && arg.includes("test"));

/**
 * General API limiter: 300 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: isTestEnv,
    message: {
        message: "Too many requests from this IP. Please try again later.",
    },
});

/**
 * Strict limiter for sensitive authentication endpoints (login, forgot-password, reset-password):
 * 10 requests per 15 minutes per IP to mitigate brute force & credential stuffing.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: isTestEnv,
    message: {
        message: "Too many attempts. Please try again in 15 minutes.",
    },
});

/**
 * Limiter for registration endpoint to prevent automated account creation DoS:
 * 10 accounts per hour per IP.
 */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: isTestEnv,
    message: {
        message:
            "Too many accounts created from this IP. Please try again in an hour.",
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    registerLimiter,
};
