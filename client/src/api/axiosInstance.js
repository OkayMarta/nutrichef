import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach JWT Bearer token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("nutrichef_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            localStorage.removeItem("nutrichef_token");
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("nutrichef:unauthorized"));
            }
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
