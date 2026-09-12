import axiosInstance from "./axiosInstance";

/**
 * GET /api/dashboard/:date
 * Fetches aggregated daily statistics, goals, and meal logs for a specific date.
 *
 * @param {string} dateStr - Date formatted as YYYY-MM-DD
 * @param {Object} [options] - Optional axios request config (e.g. signal for AbortController)
 * @returns {Promise<AxiosResponse<{ date: string, totals: Object, goals: Object, logs: Array }>>}
 */
export const getDashboardData = async (dateStr, options = {}) => {
    return axiosInstance.get(`/api/dashboard/${dateStr}`, options);
};
