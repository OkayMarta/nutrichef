/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        () => localStorage.getItem("nutrichef_token") || null,
    );
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hydrate user profile on initial load if token exists
    useEffect(() => {
        let isMounted = true;

        const fetchUserProfile = async () => {
            const storedToken = localStorage.getItem("nutrichef_token");
            if (!storedToken) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get("/api/auth/me");
                if (isMounted) {
                    setUser(response.data.user || response.data);
                }
            } catch (error) {
                console.error("Failed to hydrate user session:", error);
                localStorage.removeItem("nutrichef_token");
                if (isMounted) {
                    setToken(null);
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUserProfile();

        // Listen for unauthorized events triggered by axios interceptor
        const handleUnauthorized = () => {
            if (isMounted) {
                setToken(null);
                setUser(null);
            }
        };

        window.addEventListener("nutrichef:unauthorized", handleUnauthorized);

        return () => {
            isMounted = false;
            window.removeEventListener(
                "nutrichef:unauthorized",
                handleUnauthorized,
            );
        };
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem("nutrichef_token", newToken);
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("nutrichef_token");
        setToken(null);
        setUser(null);
    };

    const updateUser = (partialUser) => {
        setUser((prev) => (prev ? { ...prev, ...partialUser } : prev));
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loading, login, logout, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
