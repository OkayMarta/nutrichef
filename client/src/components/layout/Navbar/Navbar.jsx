import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import "./Navbar.scss";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.info("You have been logged out.");
        navigate("/login");
    };

    const getAvatarLetter = () => {
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <header className="navbar">
            <div className="navbar__container">
                {/* Brand Logo */}
                <Link to="/" className="navbar__brand">
                    <div className="navbar__logo-icon">
                        <img
                            src="/logo.svg"
                            alt="NutriChef Logo"
                            className="navbar__logo-img"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback =
                                    e.currentTarget.parentElement?.querySelector(
                                        ".navbar__logo-fallback",
                                    );
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                        <span
                            className="navbar__logo-fallback"
                            style={{ display: "none" }}
                        >
                            🍃
                        </span>
                    </div>
                    <div className="navbar__brand-text">
                        <span className="navbar__title">NutriChef</span>
                        <span className="navbar__tagline">
                            Calculate. Track. Eat better.
                        </span>
                    </div>
                </Link>

                {/* Navigation Area */}
                {user ? (
                    // Authenticated App Navigation
                    <nav className="navbar__nav navbar__nav--app">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? "navbar__link--active" : ""}`
                            }
                        >
                            <span>🏠</span>
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/meals"
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? "navbar__link--active" : ""}`
                            }
                        >
                            <span>📖</span>
                            <span>Saved Meals</span>
                        </NavLink>
                        <NavLink
                            to="/calculator"
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? "navbar__link--active" : ""}`
                            }
                        >
                            <span>➕</span>
                            <span>Create Meal</span>
                        </NavLink>
                    </nav>
                ) : (
                    // Public Landing Navigation
                    <nav className="navbar__nav">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `navbar__link navbar__link--landing ${isActive ? "navbar__link--active" : ""}`
                            }
                        >
                            Home
                        </NavLink>
                        <a
                            href="/#how-it-works"
                            className="navbar__link navbar__link--landing"
                        >
                            How it works
                        </a>
                        <a
                            href="/#features"
                            className="navbar__link navbar__link--landing"
                        >
                            Features
                        </a>
                    </nav>
                )}

                {/* Actions Area */}
                <div className="navbar__actions">
                    {user ? (
                        <div className="navbar__user">
                            <div className="navbar__avatar" title={user.email}>
                                {getAvatarLetter()}
                            </div>
                            <button
                                type="button"
                                className="navbar__logout-btn"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <Link
                                to="/login"
                                className="btn btn--secondary"
                                style={{
                                    padding: "8px 18px",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn--primary"
                                style={{
                                    padding: "8px 20px",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Get started &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
