import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/common/GoogleAuthButton";
import "./Auth.scss";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Password criteria analysis
    const criteria = useMemo(() => {
        return {
            hasMinLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasMixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    }, [password]);

    // Password score: 0 to 4
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

    // Email validation status
    const emailError = useMemo(() => {
        if (!emailTouched || !email) return "";
        const trimmed = email.trim();
        if (!EMAIL_REGEX.test(trimmed)) {
            return "Please enter a valid email address (e.g. name@example.com)";
        }
        return "";
    }, [email, emailTouched]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail && !password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!trimmedEmail) {
            toast.error("Please enter your email address.");
            return;
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            toast.error("Please provide a valid email address.");
            return;
        }

        if (!password) {
            toast.error("Please create a password.");
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
            toast.error("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axiosInstance.post("/api/auth/register", {
                email: trimmedEmail,
                password,
            });

            login(data.token, data.user);
            toast.success(
                "Account created successfully! Welcome to NutriChef.",
            );
            navigate("/dashboard");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Registration failed. Please try again.";
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
                        Start tracking cooked meals and nutrition accurately
                    </p>
                </div>

                <form
                    className="auth-page__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Email Input */}
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
                            className={`auth-page__input ${
                                emailError ? "auth-page__input--error" : ""
                            }`}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setEmailTouched(true)}
                            autoComplete="email"
                            required
                        />
                        {emailError && (
                            <span className="auth-page__error-msg">
                                {emailError}
                            </span>
                        )}
                    </div>

                    {/* Password Input with Strength Meter */}
                    <div className="auth-page__group">
                        <label
                            className="auth-page__label"
                            htmlFor="register-password"
                        >
                            Password
                        </label>
                        <div className="auth-page__password-wrapper">
                            <input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                className="auth-page__input"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
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
                                    // Eye Off Icon
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
                                    // Eye Icon
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
                                                    : strengthScore === 2
                                                      ? "auth-page__strength-segment--fair"
                                                      : strengthScore === 3
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
                                                    : strengthScore === 3
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
                                    <strong className={strengthLabel.class}>
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
                                        {criteria.hasMinLength ? "✔" : "•"} 8+
                                        characters
                                    </span>
                                    <span
                                        className={
                                            criteria.hasNumber ? "checked" : ""
                                        }
                                    >
                                        {criteria.hasNumber ? "✔" : "•"} At
                                        least 1 number
                                    </span>
                                    <span
                                        className={
                                            criteria.hasMixedCase
                                                ? "checked"
                                                : ""
                                        }
                                    >
                                        {criteria.hasMixedCase ? "✔" : "•"}{" "}
                                        Upper & lower case
                                    </span>
                                    <span
                                        className={
                                            criteria.hasSpecial ? "checked" : ""
                                        }
                                    >
                                        {criteria.hasSpecial ? "✔" : "•"}{" "}
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
                            htmlFor="register-confirm-password"
                        >
                            Confirm Password
                        </label>
                        <div className="auth-page__password-wrapper">
                            <input
                                id="register-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                className={`auth-page__input ${
                                    confirmPassword &&
                                    password !== confirmPassword
                                        ? "auth-page__input--error"
                                        : ""
                                }`}
                                placeholder="Repeat your password"
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
                                    setShowConfirmPassword(!showConfirmPassword)
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
                        {confirmPassword && password !== confirmPassword && (
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
                        {loading ? "Creating account..." : "Get started"}
                    </button>

                    <p className="auth-page__terms-subtext">
                        By creating an account, you agree to our{" "}
                        <Link to="/terms">Terms of Service</Link> and{" "}
                        <Link to="/privacy">Privacy Policy</Link>.
                    </p>
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
