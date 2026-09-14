import axiosInstance from "./axiosInstance";

/**
 * PUT /api/auth/goals
 * Updates the authenticated user's daily nutritional goals.
 */
export const updateGoals = (payload) => {
    return axiosInstance.put("/api/auth/goals", payload);
};
