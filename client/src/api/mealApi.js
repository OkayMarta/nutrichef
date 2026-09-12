import axiosInstance from "./axiosInstance";

/**
 * Helper to ensure numeric macro values are parsed as valid numbers.
 * Defaults to 0 if empty, invalid, or NaN.
 */
const parseMacro = (val) => {
    if (val === undefined || val === null || val === "") return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

/**
 * POST /api/meals
 * Creates a new meal with explicit numeric conversion for macro values.
 *
 * @param {Object} mealData
 * @param {string} mealData.name
 * @param {number|string} mealData.caloriesPer100g
 * @param {number|string} mealData.proteinPer100g
 * @param {number|string} mealData.fatPer100g
 * @param {number|string} mealData.carbsPer100g
 * @returns {Promise<AxiosResponse>}
 */
export const createMeal = async (mealData) => {
    const payload = {
        name: String(mealData.name || "").trim(),
        caloriesPer100g: parseMacro(mealData.caloriesPer100g),
        proteinPer100g: parseMacro(mealData.proteinPer100g),
        fatPer100g: parseMacro(mealData.fatPer100g),
        carbsPer100g: parseMacro(mealData.carbsPer100g),
    };

    return axiosInstance.post("/api/meals", payload);
};

/**
 * GET /api/meals
 * Fetches user's saved meals with optional search query.
 */
export const getMeals = async (search = "") => {
    const params = search?.trim() ? { search: search.trim() } : {};
    return axiosInstance.get("/api/meals", { params });
};

/**
 * GET /api/meals/:id
 * Fetches single meal details by ID.
 */
export const getMealById = async (id) => {
    return axiosInstance.get(`/api/meals/${id}`);
};

/**
 * PUT /api/meals/:id
 * Updates an existing meal with explicit numeric sanitization.
 */
export const updateMeal = async (id, mealData) => {
    const payload = {};
    if (mealData.name !== undefined) {
        payload.name = String(mealData.name).trim();
    }
    if (mealData.caloriesPer100g !== undefined) {
        payload.caloriesPer100g = parseMacro(mealData.caloriesPer100g);
    }
    if (mealData.proteinPer100g !== undefined) {
        payload.proteinPer100g = parseMacro(mealData.proteinPer100g);
    }
    if (mealData.fatPer100g !== undefined) {
        payload.fatPer100g = parseMacro(mealData.fatPer100g);
    }
    if (mealData.carbsPer100g !== undefined) {
        payload.carbsPer100g = parseMacro(mealData.carbsPer100g);
    }

    return axiosInstance.put(`/api/meals/${id}`, payload);
};

/**
 * DELETE /api/meals/:id
 * Deletes a meal by ID.
 */
export const deleteMeal = async (id) => {
    return axiosInstance.delete(`/api/meals/${id}`);
};
