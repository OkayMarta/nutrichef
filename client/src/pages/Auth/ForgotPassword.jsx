import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import "./Auth.scss";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [resending, setResending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedEmail) {
            toast.error("Please enter your email address.");
            return;
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.post("/api/auth/forgot-password", {
                email: trimmedEmail,
            });
            setSubmitted(true);
            toast.success("Password reset link sent! Check your inbox.");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to send reset link. Please check your connection and try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            await axiosInstance.post("/api/auth/forgot-password", {
                email: email.trim().toLowerCase(),
            });
            toast.success("New reset link sent! Check your inbox.");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Failed to resend email. Please try again later.";
            toast.error(message);
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__card">
                {submitted ? (
                    // Success View
                    <div className="auth-page__success-view">
                        <div className="auth-page__success-icon">
                            <CheckCircle2 size={48} strokeWidth={1.8} />
                        </div>
                        <h1 className="auth-page__title">Check your email</h1>
                        <p className="auth-page__subtitle">
                            We have sent password reset instructions to{" "}
                            <strong>{email}</strong>. The link is valid for 1
                            hour.
                        </p>
                        <p className="auth-page__hint-text">
                            Didn't receive the email? Check your spam folder or
                            click below to resend.
                        </p>

                        <button
                            type="button"
                            className="btn btn--secondary auth-page__resend-btn"
                            onClick={handleResend}
                            disabled={resending}
                        >
                            {resending ? "Sending..." : "Resend email"}
                        </button>

                        <div className="auth-page__footer">
                            <Link to="/login" className="auth-page__back-link">
                                <ArrowLeft size={16} />
                                <span>Back to log in</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Request View
                    <>
                        <div className="auth-page__header">
                            <div className="auth-page__icon-wrap">
                                <Mail size={28} strokeWidth={1.8} />
                            </div>
                            <h1 className="auth-page__title">Reset password</h1>
                            <p className="auth-page__subtitle">
                                Enter the email associated with your NutriChef
                                account, and we'll send you a link to reset your
                                password.
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
                                    htmlFor="forgot-email"
                                >
                                    Email address
                                </label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    className="auth-page__input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn--primary auth-page__submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending link..."
                                    : "Send reset link"}
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

export default ForgotPassword;
