import axiosInstance from "./axiosInstance";

/**
 * PUT /api/auth/goals
 * Updates the authenticated user's daily nutritional goals.
 */
export const updateGoals = (payload) => {
    return axiosInstance.put("/api/auth/goals", payload);
};

/**
 * PUT /api/auth/profile
 * Updates the authenticated user's profile details (name).
 */
export const updateProfile = (payload) => {
    return axiosInstance.put("/api/auth/profile", payload);
};

/**
 * POST /api/auth/avatar
 * Uploads an avatar image for the authenticated user.
 */
export const uploadAvatar = (formData) => {
    return axiosInstance.post("/api/auth/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
