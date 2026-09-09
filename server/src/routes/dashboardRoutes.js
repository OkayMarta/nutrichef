const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Enforce authMiddleware for dashboard endpoints
router.use(authMiddleware);

// GET /api/dashboard/:date
router.get("/:date", getDashboardData);

module.exports = router;
