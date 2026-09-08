const jwt = require("jsonwebtoken");

/**
 * Authentication middleware to verify JWT tokens in the Authorization header.
 * Expects format: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization || req.headers["authorization"];

        if (
            !authHeader ||
            typeof authHeader !== "string" ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Authorization header missing or malformed",
            });
        }

        const token = authHeader.split(" ")[1]?.trim();

        if (!token) {
            return res.status(401).json({
                message: "Token not provided in Authorization header",
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({
                message: "Internal server error: auth configuration missing",
            });
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        message: "Token has expired",
                    });
                }
                return res.status(401).json({
                    message: "Invalid token",
                });
            }

            if (!decoded || !decoded.userId) {
                return res.status(401).json({
                    message: "Invalid token payload",
                });
            }

            req.userId = decoded.userId;
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error during authentication",
            error: error.message,
        });
    }
};

module.exports = authMiddleware;
