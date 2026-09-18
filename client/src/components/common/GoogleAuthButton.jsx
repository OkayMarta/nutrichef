import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import "./GoogleAuthButton.scss";

const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "611925401354-pgnjj33a1ms8btcfgg8j41c9kmf3av30.apps.googleusercontent.com";

// Module-level singleton tracking to prevent duplicate initialize() calls
let isGsiInitialized = false;
let activeAuthCallback = null;

const ensureGsiInitialized = () => {
    if (window.google?.accounts?.id && !isGsiInitialized) {
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
                if (activeAuthCallback) {
                    activeAuthCallback(response);
                }
            },
        });
        isGsiInitialized = true;
    }
};

const GoogleAuthButton = ({ isRegister = false }) => {
    const buttonRef = useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [gsiReady, setGsiReady] = useState(false);
    const isMountedRef = useRef(true);

    const handleCredentialResponse = useCallback(
        async (response) => {
            if (!response.credential) {
                toast.error("Google authentication failed. No token received.");
                return;
            }
            try {
                setLoading(true);
                const { data } = await axiosInstance.post("/api/auth/google", {
                    token: response.credential,
                });
                login(data.token, data.user);
                toast.success(
                    isRegister
                        ? "Welcome to NutriChef!"
                        : "Successfully logged in with Google!",
                );
                navigate("/dashboard");
            } catch (error) {
                console.error("Google auth error:", error);
                const msg =
                    error.response?.data?.message ||
                    "Google authentication failed";
                toast.error(msg);
            } finally {
                if (isMountedRef.current) setLoading(false);
            }
        },
        [isRegister, login, navigate],
    );

    const callbackRef = useRef(handleCredentialResponse);
    useEffect(() => {
        callbackRef.current = handleCredentialResponse;
    });

    useEffect(() => {
        isMountedRef.current = true;
        activeAuthCallback = (res) => callbackRef.current?.(res);
        return () => {
            isMountedRef.current = false;
            activeAuthCallback = null;
        };
    }, []);

    useEffect(() => {
        let checkInterval;

        const initGoogleSignIn = () => {
            if (window.google?.accounts?.id && buttonRef.current) {
                try {
                    ensureGsiInitialized();

                    // Clear previous button elements before re-rendering
                    buttonRef.current.innerHTML = "";

                    // Calculate valid button width in pixels (Google GSI requires 200..400 px, no percentages)
                    const parentWidth =
                        buttonRef.current.offsetWidth ||
                        buttonRef.current.parentElement?.offsetWidth ||
                        376;
                    const buttonWidth = Math.min(
                        Math.max(Math.round(parentWidth), 200),
                        400,
                    );

                    window.google.accounts.id.renderButton(buttonRef.current, {
                        theme: "outline",
                        size: "large",
                        type: "standard",
                        shape: "rectangular",
                        text: isRegister ? "signup_with" : "signin_with",
                        width: buttonWidth,
                        logo_alignment: "left",
                    });

                    if (isMountedRef.current) setGsiReady(true);
                    return true;
                } catch (e) {
                    console.error("Error rendering Google Sign-In button:", e);
                }
            }
            return false;
        };

        if (!initGoogleSignIn()) {
            checkInterval = setInterval(() => {
                if (initGoogleSignIn()) {
                    clearInterval(checkInterval);
                }
            }, 300);
        }

        const handleResize = () => {
            if (window.google?.accounts?.id && buttonRef.current) {
                initGoogleSignIn();
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (checkInterval) clearInterval(checkInterval);
            window.removeEventListener("resize", handleResize);
        };
    }, [isRegister]);

    return (
        <div className="google-auth">
            <div
                ref={buttonRef}
                className={`google-auth__button-container ${!gsiReady ? "google-auth__button-container--loading" : ""}`}
            />

            {/* Fallback button shown if GSI is loading or unavailable */}
            {!gsiReady && (
                <button
                    type="button"
                    className="google-auth__fallback-btn"
                    disabled={loading}
                    onClick={() => {
                        if (window.google?.accounts?.id) {
                            ensureGsiInitialized();
                            window.google.accounts.id.prompt();
                        } else {
                            toast.info(
                                "Loading Google Sign-In service. Please wait or check your internet connection.",
                            );
                        }
                    }}
                >
                    <svg
                        className="google-auth__icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                    </svg>
                    <span>
                        {isRegister
                            ? "Sign up with Google"
                            : "Sign in with Google"}
                    </span>
                </button>
            )}

            {loading && (
                <div className="google-auth__loading-overlay">
                    <span>Authenticating with Google...</span>
                </div>
            )}
        </div>
    );
};

export default GoogleAuthButton;
