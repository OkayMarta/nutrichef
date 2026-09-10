import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/common/GoogleAuthButton";
import "./Auth.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post("/api/auth/login", {
                email: email.trim(),
                password,
            });

            login(data.token, data.user);
            toast.success("Welcome back!");
            navigate("/dashboard");
        } catch (error) {
            const message =
                error.response?.data?.message || "Invalid email or password.";
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

                <form className="auth-page__form" onSubmit={handleSubmit}>
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
                        <input
                            id="login-password"
                            type="password"
                            className="auth-page__input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
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
