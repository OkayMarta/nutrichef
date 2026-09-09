const express = require("express");
const {
    createDailyLog,
    getDailyLogs,
    getDailyLogById,
    updateDailyLog,
    deleteDailyLog,
} = require("../controllers/dailyLogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authMiddleware to protect all log routes
router.use(authMiddleware);

// Daily Log CRUD routes
router.post("/", createDailyLog);
router.get("/", getDailyLogs);
router.get("/:id", getDailyLogById);
router.put("/:id", updateDailyLog);
router.delete("/:id", deleteDailyLog);

module.exports = router;
