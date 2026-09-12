import axiosInstance from "./axiosInstance";

/**
 * POST /api/logs
 * Creates a new daily log for a meal.
 *
 * @param {Object} logData
 * @param {string} logData.mealId
 * @param {string} logData.date - "YYYY-MM-DD"
 * @param {string} logData.mealType - "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK"
 * @param {number|string} logData.consumedGrams
 * @returns {Promise<AxiosResponse>}
 */
export const createDailyLog = async (logData) => {
    const payload = {
        mealId: String(logData.mealId || "").trim(),
        date: String(logData.date || "").trim(),
        mealType: String(logData.mealType || "").trim(),
        consumedGrams: parseFloat(logData.consumedGrams) || 0,
    };

    return axiosInstance.post("/api/logs", payload);
};

/**
 * DELETE /api/logs/:id
 * Deletes a daily log by ID.
 *
 * @param {string} logId
 * @returns {Promise<AxiosResponse>}
 */
export const deleteDailyLog = async (logId) => {
    return axiosInstance.delete(`/api/logs/${logId}`);
};

/**
 * PUT /api/logs/:id
 * Updates an existing daily log.
 *
 * @param {string} logId
 * @param {Object} updateData
 * @returns {Promise<AxiosResponse>}
 */
export const updateDailyLog = async (logId, updateData) => {
    const payload = {};
    if (updateData.consumedGrams !== undefined) {
        payload.consumedGrams = parseFloat(updateData.consumedGrams) || 0;
    }
    if (updateData.mealType !== undefined) {
        payload.mealType = String(updateData.mealType).trim();
    }
    if (updateData.date !== undefined) {
        payload.date = String(updateData.date).trim();
    }

    return axiosInstance.put(`/api/logs/${logId}`, payload);
};
