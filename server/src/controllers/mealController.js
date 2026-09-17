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

/**
 * Helper to validate non-negative numeric macro values.
 */
const isValidMacro = (value) => {
    if (value === undefined || value === null) return false;
    const num = Number(value);
    return typeof num === "number" && !isNaN(num) && isFinite(num) && num >= 0;
};

/**
 * POST /api/meals
 * Create a new meal for the authenticated user.
 */
const createMeal = async (req, res) => {
    try {
        const {
            name,
            caloriesPer100g,
            proteinPer100g,
            fatPer100g,
            carbsPer100g,
        } = req.body;

        // Validate name
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Meal name is required and must be a non-empty string",
            });
        }

        if (name.trim().length > 60) {
            return res.status(400).json({
                message: "Meal name cannot exceed 60 characters",
            });
        }

        // Validate macros
        if (!isValidMacro(caloriesPer100g)) {
            return res.status(400).json({
                message: "caloriesPer100g must be a valid non-negative number",
            });
        }

        if (!isValidMacro(proteinPer100g)) {
            return res.status(400).json({
                message: "proteinPer100g must be a valid non-negative number",
            });
        }

        if (!isValidMacro(fatPer100g)) {
            return res.status(400).json({
                message: "fatPer100g must be a valid non-negative number",
            });
        }

        if (!isValidMacro(carbsPer100g)) {
            return res.status(400).json({
                message: "carbsPer100g must be a valid non-negative number",
            });
        }

        const meal = await prisma.meal.create({
            data: {
                name: name.trim(),
                caloriesPer100g: Number(caloriesPer100g),
                proteinPer100g: Number(proteinPer100g),
                fatPer100g: Number(fatPer100g),
                carbsPer100g: Number(carbsPer100g),
                userId: req.userId,
            },
        });

        return res.status(201).json(meal);
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while creating the meal",
            error,
        );
    }
};

/**
 * GET /api/meals
 * List & search meals for the authenticated user only.
 */
const getMeals = async (req, res) => {
    try {
        const { search } = req.query;

        const where = {
            userId: req.userId,
        };

        if (search && typeof search === "string" && search.trim()) {
            where.name = {
                contains: search.trim(),
                mode: "insensitive",
            };
        }

        const meals = await prisma.meal.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json(meals);
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while fetching meals",
            error,
        );
    }
};

/**
 * GET /api/meals/:id
 * Fetch a single meal by ID with ownership verification.
 */
const getMealById = async (req, res) => {
    try {
        const { id } = req.params;

        const meal = await prisma.meal.findUnique({
            where: { id },
        });

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        if (meal.userId !== req.userId) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have permission to view this meal",
            });
        }

        return res.status(200).json(meal);
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while fetching the meal",
            error,
        );
    }
};

/**
 * PUT /api/meals/:id
 * Update an existing meal with ownership verification.
 */
const updateMeal = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            caloriesPer100g,
            proteinPer100g,
            fatPer100g,
            carbsPer100g,
        } = req.body;

        const meal = await prisma.meal.findUnique({
            where: { id },
        });

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        if (meal.userId !== req.userId) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have permission to update this meal",
            });
        }

        const updateData = {};

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    message: "Meal name must be a non-empty string",
                });
            }
            if (name.trim().length > 60) {
                return res.status(400).json({
                    message: "Meal name cannot exceed 60 characters",
                });
            }
            updateData.name = name.trim();
        }

        if (caloriesPer100g !== undefined) {
            if (!isValidMacro(caloriesPer100g)) {
                return res.status(400).json({
                    message:
                        "caloriesPer100g must be a valid non-negative number",
                });
            }
            updateData.caloriesPer100g = Number(caloriesPer100g);
        }

        if (proteinPer100g !== undefined) {
            if (!isValidMacro(proteinPer100g)) {
                return res.status(400).json({
                    message:
                        "proteinPer100g must be a valid non-negative number",
                });
            }
            updateData.proteinPer100g = Number(proteinPer100g);
        }

        if (fatPer100g !== undefined) {
            if (!isValidMacro(fatPer100g)) {
                return res.status(400).json({
                    message: "fatPer100g must be a valid non-negative number",
                });
            }
            updateData.fatPer100g = Number(fatPer100g);
        }

        if (carbsPer100g !== undefined) {
            if (!isValidMacro(carbsPer100g)) {
                return res.status(400).json({
                    message: "carbsPer100g must be a valid non-negative number",
                });
            }
            updateData.carbsPer100g = Number(carbsPer100g);
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "At least one field must be provided to update",
            });
        }

        const updatedMeal = await prisma.meal.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json(updatedMeal);
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while updating the meal",
            error,
        );
    }
};

/**
 * DELETE /api/meals/:id
 * Delete a meal with ownership verification.
 */
const deleteMeal = async (req, res) => {
    try {
        const { id } = req.params;

        const meal = await prisma.meal.findUnique({
            where: { id },
        });

        if (!meal) {
            return res.status(404).json({
                message: "Meal not found",
            });
        }

        if (meal.userId !== req.userId) {
            return res.status(403).json({
                message:
                    "Forbidden: You do not have permission to delete this meal",
            });
        }

        await prisma.meal.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Meal deleted successfully",
        });
    } catch (error) {
        return safeError(
            res,
            500,
            "An error occurred while deleting the meal",
            error,
        );
    }
};

module.exports = {
    createMeal,
    getMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};
