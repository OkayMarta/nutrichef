const prisma = require("../lib/prisma");

const VALID_MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

/**
 * Helper to calculate macro snapshots from meal per 100g values and consumed weight.
 * factor = consumedGrams / 100
 * snapshot = Number((mealMacro * factor).toFixed(2))
 */
const calculateSnapshots = (meal, consumedGrams) => {
    const factor = consumedGrams / 100;
    return {
        snapshotCalories: Number((meal.caloriesPer100g * factor).toFixed(2)),
        snapshotProtein: Number((meal.proteinPer100g * factor).toFixed(2)),
        snapshotFat: Number((meal.fatPer100g * factor).toFixed(2)),
        snapshotCarbs: Number((meal.carbsPer100g * factor).toFixed(2)),
    };
};

/**
 * POST /api/logs
 * Create a new daily log for the authenticated user.
 */
const createDailyLog = async (req, res) => {
    try {
        const { mealId, date, mealType, consumedGrams } = req.body;

        // Validate mealId
        if (!mealId || typeof mealId !== "string" || !mealId.trim()) {
            return res.status(400).json({
                message: "mealId is required and must be a valid string",
            });
        }

        // Validate date
        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).json({
                message:
                    "date is required and must be a valid date or ISO string",
            });
        }

        // Validate mealType
        if (!mealType || !VALID_MEAL_TYPES.includes(mealType)) {
            return res.status(400).json({
                message: `mealType is required and must be one of: ${VALID_MEAL_TYPES.join(", ")}`,
            });
        }

        // Validate consumedGrams
        if (
            consumedGrams === undefined ||
            consumedGrams === null ||
            isNaN(Number(consumedGrams)) ||
            !isFinite(Number(consumedGrams)) ||
            Number(consumedGrams) <= 0
        ) {
            return res.status(400).json({
                message:
                    "consumedGrams is required and must be a positive finite number (> 0)",
            });
        }

        // Verify meal exists and belongs to the authenticated user
        const meal = await prisma.meal.findFirst({
            where: {
                id: mealId.trim(),
                userId: req.userId,
            },
        });

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        const numericGrams = Number(consumedGrams);
        const snapshots = calculateSnapshots(meal, numericGrams);

        const log = await prisma.dailyLog.create({
            data: {
                userId: req.userId,
                mealId: meal.id,
                date: new Date(date),
                mealType,
                consumedGrams: numericGrams,
                ...snapshots,
            },
            include: {
                meal: true,
            },
        });

        return res.status(201).json(log);
    } catch (error) {
        console.error("Create daily log error:", error);
        return res.status(500).json({
            message: "An error occurred while creating the daily log",
            error: error.message,
        });
    }
};

/**
 * GET /api/logs
 * Retrieve daily logs for the authenticated user, with optional date filtering.
 */
const getDailyLogs = async (req, res) => {
    try {
        const { date } = req.query;

        const where = {
            userId: req.userId,
        };

        if (date) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    message: "Invalid date format provided in query parameters",
                });
            }

            // Filter between 00:00:00.000 and 23:59:59.999 UTC for that day
            const startOfDay = new Date(
                Date.UTC(
                    parsedDate.getUTCFullYear(),
                    parsedDate.getUTCMonth(),
                    parsedDate.getUTCDate(),
                    0,
                    0,
                    0,
                    0,
                ),
            );
            const endOfDay = new Date(
                Date.UTC(
                    parsedDate.getUTCFullYear(),
                    parsedDate.getUTCMonth(),
                    parsedDate.getUTCDate(),
                    23,
                    59,
                    59,
                    999,
                ),
            );

            where.date = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }

        const logs = await prisma.dailyLog.findMany({
            where,
            include: {
                meal: true,
            },
            orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        });

        return res.status(200).json(logs);
    } catch (error) {
        console.error("Get daily logs error:", error);
        return res.status(500).json({
            message: "An error occurred while fetching daily logs",
            error: error.message,
        });
    }
};

/**
 * GET /api/logs/:id
 * Retrieve a single daily log by ID with ownership verification.
 */
const getDailyLogById = async (req, res) => {
    try {
        const { id } = req.params;

        const log = await prisma.dailyLog.findUnique({
            where: { id },
            include: {
                meal: true,
            },
        });

        if (!log) {
            return res.status(404).json({
                message: "Daily log not found",
            });
        }

        if (log.userId !== req.userId) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have permission to view this daily log",
            });
        }

        return res.status(200).json(log);
    } catch (error) {
        console.error("Get daily log by id error:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the daily log",
            error: error.message,
        });
    }
};

/**
 * PUT /api/logs/:id
 * Update an existing daily log. Recalculates snapshots if consumedGrams changes.
 */
const updateDailyLog = async (req, res) => {
    try {
        const { id } = req.params;
        const { mealType, consumedGrams, date } = req.body;

        const log = await prisma.dailyLog.findUnique({
            where: { id },
            include: {
                meal: true,
            },
        });

        if (!log) {
            return res.status(404).json({
                message: "Daily log not found",
            });
        }

        if (log.userId !== req.userId) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have permission to update this daily log",
            });
        }

        const updateData = {};

        if (mealType !== undefined) {
            if (!VALID_MEAL_TYPES.includes(mealType)) {
                return res.status(400).json({
                    message: `Invalid mealType. Must be one of: ${VALID_MEAL_TYPES.join(", ")}`,
                });
            }
            updateData.mealType = mealType;
        }

        if (date !== undefined) {
            if (!date || isNaN(new Date(date).getTime())) {
                return res.status(400).json({
                    message: "Invalid date provided",
                });
            }
            updateData.date = new Date(date);
        }

        if (consumedGrams !== undefined) {
            if (
                isNaN(Number(consumedGrams)) ||
                !isFinite(Number(consumedGrams)) ||
                Number(consumedGrams) <= 0
            ) {
                return res.status(400).json({
                    message:
                        "consumedGrams must be a positive finite number (> 0)",
                });
            }

            const numericGrams = Number(consumedGrams);
            updateData.consumedGrams = numericGrams;

            // Recalculate snapshot macros using the meal data
            const snapshots = calculateSnapshots(log.meal, numericGrams);
            Object.assign(updateData, snapshots);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "At least one field must be provided to update",
            });
        }

        const updatedLog = await prisma.dailyLog.update({
            where: { id },
            data: updateData,
            include: {
                meal: true,
            },
        });

        return res.status(200).json(updatedLog);
    } catch (error) {
        console.error("Update daily log error:", error);
        return res.status(500).json({
            message: "An error occurred while updating the daily log",
            error: error.message,
        });
    }
};

/**
 * DELETE /api/logs/:id
 * Delete a daily log with ownership verification.
 */
const deleteDailyLog = async (req, res) => {
    try {
        const { id } = req.params;

        const log = await prisma.dailyLog.findUnique({
            where: { id },
        });

        if (!log) {
            return res.status(404).json({
                message: "Daily log not found",
            });
        }

        if (log.userId !== req.userId) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have permission to delete this daily log",
            });
        }

        await prisma.dailyLog.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Daily log deleted successfully",
        });
    } catch (error) {
        console.error("Delete daily log error:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the daily log",
            error: error.message,
        });
    }
};

module.exports = {
    createDailyLog,
    getDailyLogs,
    getDailyLogById,
    updateDailyLog,
    deleteDailyLog,
    calculateSnapshots,
};
