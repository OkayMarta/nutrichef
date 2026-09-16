import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/common/GoogleAuthButton";
import "./Auth.scss";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail && !password) {
            toast.error("Please enter your email and password.");
            return;
        }

        if (!trimmedEmail) {
            toast.error("Please enter your email address.");
            return;
        }

        if (!password) {
            toast.error("Please enter your password.");
            return;
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post("/api/auth/login", {
                email: trimmedEmail,
                password,
            });

            login(data.token, data.user);
            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to log in. Please check your connection and try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <h1 className="auth-page__title">Welcome back</h1>
                    <p className="auth-page__subtitle">
                        Log in to track your meals and nutrition
                    </p>
                </div>

                <form
                    className="auth-page__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="auth-page__group">
                        <label
                            className="auth-page__label"
                            htmlFor="login-email"
                        >
                            Email address
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            className="auth-page__input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-page__group">
                        <label
                            className="auth-page__label"
                            htmlFor="login-password"
                        >
                            Password
                        </label>
                        <div className="auth-page__password-wrapper">
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                className="auth-page__input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="auth-page__toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary auth-page__submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <div className="auth-page__divider">
                    <span>or continue with</span>
                </div>

                {/* Google Sign In */}
                <GoogleAuthButton isRegister={false} />

                <div className="auth-page__footer">
                    Don't have an account?
                    <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
