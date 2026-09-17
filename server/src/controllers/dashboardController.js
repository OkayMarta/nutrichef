const prisma = require("../lib/prisma");

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

const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;

/**
 * GET /api/dashboard/:date
 * Aggregates daily nutritional statistics, logs, and user goals.
 */
const getDashboardData = async (req, res) => {
    try {
        const { date } = req.params;

        if (!date || typeof date !== "string" || !isoDateRegex.test(date)) {
            return res.status(400).json({
                message:
                    "Invalid date format. Expected valid ISO format (e.g., YYYY-MM-DD)",
            });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date value. Expected a valid calendar date",
            });
        }

        const year = parsedDate.getUTCFullYear();
        const month = parsedDate.getUTCMonth();
        const day = parsedDate.getUTCDate();

        const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

        const [user, logs] = await Promise.all([
            prisma.user.findUnique({
                where: { id: req.userId },
                select: {
                    goalCalories: true,
                    goalProtein: true,
                    goalFat: true,
                    goalCarbs: true,
                },
            }),
            prisma.dailyLog.findMany({
                where: {
                    userId: req.userId,
                    date: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
                include: {
                    meal: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            }),
        ]);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        let totalCalories = 0;
        let totalProtein = 0;
        let totalFat = 0;
        let totalCarbs = 0;

        for (const log of logs) {
            totalCalories += log.snapshotCalories || 0;
            totalProtein += log.snapshotProtein || 0;
            totalFat += log.snapshotFat || 0;
            totalCarbs += log.snapshotCarbs || 0;
        }

        const totals = {
            calories: Number(totalCalories.toFixed(2)),
            protein: Number(totalProtein.toFixed(2)),
            fat: Number(totalFat.toFixed(2)),
            carbs: Number(totalCarbs.toFixed(2)),
        };

        const goals = {
            calories: user.goalCalories ?? null,
            protein: user.goalProtein ?? null,
            fat: user.goalFat ?? null,
            carbs: user.goalCarbs ?? null,
        };

        return res.status(200).json({
            date: formattedDate,
            totals,
            goals,
            logs,
        });
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while fetching dashboard summary",
            error,
        );
    }
};

module.exports = {
    getDashboardData,
};
