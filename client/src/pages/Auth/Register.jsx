import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/common/GoogleAuthButton";
import "./Auth.scss";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post("/api/auth/register", {
                email: email.trim(),
                password,
            });

            login(data.token, data.user);
            toast.success(
                "Account created successfully! Welcome to NutriChef.",
            );
            navigate("/dashboard");
        } catch (error) {
            const message =
                error.response?.data?.message || "Registration failed.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__header">
                    <h1 className="auth-page__title">Create an account</h1>
                    <p className="auth-page__subtitle">
                        Start tracking cooked meals accurately
                    </p>
                </div>

                <form className="auth-page__form" onSubmit={handleSubmit}>
                    <div className="auth-page__group">
                        <label
                            className="auth-page__label"
                            htmlFor="register-email"
                        >
                            Email address
                        </label>
                        <input
                            id="register-email"
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
                            htmlFor="register-password"
                        >
                            Password
                        </label>
                        <input
                            id="register-password"
                            type="password"
                            className="auth-page__input"
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="auth-page__group">
                        <label
                            className="auth-page__label"
                            htmlFor="register-confirm-password"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="register-confirm-password"
                            type="password"
                            className="auth-page__input"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary auth-page__submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Get started"}
                    </button>
                </form>

                <div className="auth-page__divider">
                    <span>or continue with</span>
                </div>

                {/* Google Sign In */}
                <GoogleAuthButton isRegister={true} />

                <div className="auth-page__footer">
                    Already have an account?
                    <Link to="/login">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
