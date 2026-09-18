import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach JWT Bearer token & sanitize numeric payloads
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("nutrichef_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Ensure meal macros are strictly numbers (not strings) before POST/PUT to /api/meals
        if (
            config.data &&
            typeof config.data === "object" &&
            typeof config.url === "string" &&
            config.url.includes("/api/meals")
        ) {
            const macroFields = [
                "caloriesPer100g",
                "proteinPer100g",
                "fatPer100g",
                "carbsPer100g",
            ];
            macroFields.forEach((field) => {
                if (field in config.data && config.data[field] !== undefined) {
                    const parsed = parseFloat(config.data[field]);
                    config.data[field] = isNaN(parsed) ? 0 : parsed;
                }
            });
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 Unauthorized
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Exclude routine auth submission endpoints (login / register) from triggering global session cleanup
            const requestUrl =
                typeof error.config?.url === "string" ? error.config.url : "";
            const isAuthSubmission =
                requestUrl.includes("/api/auth/login") ||
                requestUrl.includes("/api/auth/register") ||
                requestUrl.includes("/api/auth/google");

            if (!isAuthSubmission) {
                localStorage.removeItem("nutrichef_token");
                if (typeof window !== "undefined") {
                    window.dispatchEvent(
                        new CustomEvent("nutrichef:unauthorized"),
                    );
                }
            }
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
