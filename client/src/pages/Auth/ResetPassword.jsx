import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, KeyRound, AlertTriangle } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import "./Auth.scss";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Password criteria analysis matching Register.jsx
    const criteria = useMemo(() => {
        return {
            hasMinLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasMixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    }, [password]);

    const strengthScore = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (criteria.hasMinLength) score++;
        if (criteria.hasNumber) score++;
        if (criteria.hasMixedCase) score++;
        if (criteria.hasSpecial) score++;
        return score;
    }, [password, criteria]);

    const strengthLabel = useMemo(() => {
        if (!password) return { text: "Empty", class: "" };
        if (strengthScore <= 1)
            return { text: "Weak", class: "strength--weak" };
        if (strengthScore === 2)
            return { text: "Fair", class: "strength--fair" };
        if (strengthScore === 3)
            return { text: "Good", class: "strength--good" };
        return { text: "Strong", class: "strength--strong" };
    }, [password, strengthScore]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            toast.error("Please enter a new password.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (!criteria.hasNumber) {
            toast.error("Password must contain at least one number.");
            return;
        }

        if (!criteria.hasMixedCase) {
            toast.error(
                "Password must contain both uppercase and lowercase letters.",
            );
            return;
        }

        if (!criteria.hasSpecial) {
            toast.error(
                "Password must contain at least one special character.",
            );
            return;
        }

        if (!confirmPassword) {
            toast.error("Please confirm your new password.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post("/api/auth/reset-password", {
                token,
                password,
            });
            setIsSuccess(true);
            toast.success("Password reset successfully! You can now log in.");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to reset password. Please request a new link.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                {!token ? (
                    // Missing Token View
                    <div className="auth-page__success-view">
                        <div className="auth-page__icon-wrap auth-page__icon-wrap--error">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="auth-page__title">Invalid reset link</h1>
                        <p className="auth-page__subtitle">
                            This password reset link is missing a security token
                            or has expired. Please request a new one.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="btn btn--primary auth-page__submit-btn"
                        >
                            Request new link
                        </Link>
                        <div className="auth-page__footer">
                            <Link to="/login" className="auth-page__back-link">
                                <ArrowLeft size={16} />
                                <span>Back to log in</span>
                            </Link>
                        </div>
                    </div>
                ) : isSuccess ? (
                    // Success View
                    <div className="auth-page__success-view">
                        <div className="auth-page__success-icon">
                            <CheckCircle2 size={48} strokeWidth={1.8} />
                        </div>
                        <h1 className="auth-page__title">Password reset!</h1>
                        <p className="auth-page__subtitle">
                            Your password has been successfully updated. You can
                            now use your new password to log in.
                        </p>
                        <button
                            type="button"
                            className="btn btn--primary auth-page__submit-btn"
                            onClick={() => navigate("/login")}
                        >
                            Log in now
                        </button>
                    </div>
                ) : (
                    // Reset Form View
                    <>
                        <div className="auth-page__header">
                            <div className="auth-page__icon-wrap">
                                <KeyRound size={28} strokeWidth={1.8} />
                            </div>
                            <h1 className="auth-page__title">
                                Set new password
                            </h1>
                            <p className="auth-page__subtitle">
                                Create a strong password to protect your
                                account.
                            </p>
                        </div>

                        <form
                            className="auth-page__form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {/* New Password Input */}
                            <div className="auth-page__group">
                                <label
                                    className="auth-page__label"
                                    htmlFor="reset-new-password"
                                >
                                    New password
                                </label>
                                <div className="auth-page__password-wrapper">
                                    <input
                                        id="reset-new-password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="auth-page__input"
                                        placeholder="Enter your new password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="auth-page__toggle-btn"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                                                <line
                                                    x1="1"
                                                    y1="1"
                                                    x2="23"
                                                    y2="23"
                                                />
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

                                {/* Visual Strength Meter */}
                                {password && (
                                    <div className="auth-page__strength">
                                        <div className="auth-page__strength-bars">
                                            <div
                                                className={`auth-page__strength-segment ${
                                                    strengthScore >= 1
                                                        ? strengthScore === 1
                                                            ? "auth-page__strength-segment--weak"
                                                            : strengthScore ===
                                                                2
                                                              ? "auth-page__strength-segment--fair"
                                                              : strengthScore ===
                                                                  3
                                                                ? "auth-page__strength-segment--good"
                                                                : "auth-page__strength-segment--strong"
                                                        : ""
                                                }`}
                                            />
                                            <div
                                                className={`auth-page__strength-segment ${
                                                    strengthScore >= 2
                                                        ? strengthScore === 2
                                                            ? "auth-page__strength-segment--fair"
                                                            : strengthScore ===
                                                                3
                                                              ? "auth-page__strength-segment--good"
                                                              : "auth-page__strength-segment--strong"
                                                        : ""
                                                }`}
                                            />
                                            <div
                                                className={`auth-page__strength-segment ${
                                                    strengthScore >= 3
                                                        ? strengthScore === 3
                                                            ? "auth-page__strength-segment--good"
                                                            : "auth-page__strength-segment--strong"
                                                        : ""
                                                }`}
                                            />
                                            <div
                                                className={`auth-page__strength-segment ${
                                                    strengthScore >= 4
                                                        ? "auth-page__strength-segment--strong"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                        <div className="auth-page__strength-label">
                                            <span>Security:</span>
                                            <strong
                                                className={strengthLabel.class}
                                            >
                                                {strengthLabel.text}
                                            </strong>
                                        </div>

                                        <div className="auth-page__checklist">
                                            <span
                                                className={
                                                    criteria.hasMinLength
                                                        ? "checked"
                                                        : ""
                                                }
                                            >
                                                {criteria.hasMinLength
                                                    ? "✔"
                                                    : "•"}{" "}
                                                8+ characters
                                            </span>
                                            <span
                                                className={
                                                    criteria.hasNumber
                                                        ? "checked"
                                                        : ""
                                                }
                                            >
                                                {criteria.hasNumber ? "✔" : "•"}{" "}
                                                At least 1 number
                                            </span>
                                            <span
                                                className={
                                                    criteria.hasMixedCase
                                                        ? "checked"
                                                        : ""
                                                }
                                            >
                                                {criteria.hasMixedCase
                                                    ? "✔"
                                                    : "•"}{" "}
                                                Upper & lower case
                                            </span>
                                            <span
                                                className={
                                                    criteria.hasSpecial
                                                        ? "checked"
                                                        : ""
                                                }
                                            >
                                                {criteria.hasSpecial
                                                    ? "✔"
                                                    : "•"}{" "}
                                                Special character
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div className="auth-page__group">
                                <label
                                    className="auth-page__label"
                                    htmlFor="reset-confirm-password"
                                >
                                    Confirm new password
                                </label>
                                <div className="auth-page__password-wrapper">
                                    <input
                                        id="reset-confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`auth-page__input ${
                                            confirmPassword &&
                                            password !== confirmPassword
                                                ? "auth-page__input--error"
                                                : ""
                                        }`}
                                        placeholder="Repeat your new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-page__toggle-btn"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line
                                                    x1="1"
                                                    y1="1"
                                                    x2="23"
                                                    y2="23"
                                                />
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
                                {confirmPassword &&
                                    password !== confirmPassword && (
                                        <span className="auth-page__error-msg">
                                            Passwords do not match.
                                        </span>
                                    )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn--primary auth-page__submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Updating password..."
                                    : "Set new password"}
                            </button>
                        </form>

                        <div className="auth-page__footer">
                            <Link to="/login" className="auth-page__back-link">
                                <ArrowLeft size={16} />
                                <span>Back to log in</span>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
