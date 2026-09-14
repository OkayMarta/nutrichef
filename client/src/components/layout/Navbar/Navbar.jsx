import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { House, BookMarked, CirclePlus, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getUserDisplayName, getUserInitials } from "../../../utils/user";
import "./Navbar.scss";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState("home");
    const isManualScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click or Escape key
    useEffect(() => {
        if (!isDropdownOpen) return;

        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isDropdownOpen]);

    // Scroll spy for landing page sections
    useEffect(() => {
        if (location.pathname !== "/") {
            return;
        }

        const handleScroll = () => {
            // Ignore scroll events during programmatic click scrolling
            if (isManualScrollingRef.current) {
                return;
            }

            const scrollY = window.scrollY;
            const howItWorksEl = document.getElementById("how-it-works");
            const featuresEl = document.getElementById("features");

            if (scrollY < 200) {
                setActiveSection("home");
                return;
            }

            // Near page bottom
            if (
                window.innerHeight + scrollY >=
                document.documentElement.scrollHeight - 150
            ) {
                setActiveSection("features");
                return;
            }

            const viewportCenter = scrollY + window.innerHeight / 2;

            if (featuresEl) {
                const top = featuresEl.offsetTop;
                const bottom = top + featuresEl.offsetHeight;
                if (viewportCenter >= top && viewportCenter <= bottom) {
                    setActiveSection("features");
                    return;
                }
            }

            if (howItWorksEl) {
                const top = howItWorksEl.offsetTop;
                const bottom = top + howItWorksEl.offsetHeight;
                if (viewportCenter >= top && viewportCenter <= bottom) {
                    setActiveSection("how-it-works");
                    return;
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [location.pathname]);

    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        setActiveSection(sectionId);

        if (location.pathname !== "/") {
            navigate(`/#${sectionId === "home" ? "" : sectionId}`);
            return;
        }

        // Lock scroll spy to prevent back-and-forth blinking during smooth scroll
        isManualScrollingRef.current = true;
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        const unlockScroll = () => {
            isManualScrollingRef.current = false;
            window.removeEventListener("scrollend", unlockScroll);
        };

        window.addEventListener("scrollend", unlockScroll, { once: true });
        scrollTimeoutRef.current = setTimeout(unlockScroll, 850);

        if (sectionId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        toast.info("You have been logged out.");
        navigate("/login");
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
                            <House
                                className="navbar__link-icon"
                                size={18}
                                strokeWidth={2}
                            />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/meals"
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? "navbar__link--active" : ""}`
                            }
                        >
                            <BookMarked
                                className="navbar__link-icon"
                                size={18}
                                strokeWidth={2}
                            />
                            <span>Saved Meals</span>
                        </NavLink>
                        <NavLink
                            to="/calculator"
                            className={({ isActive }) =>
                                `navbar__link ${isActive ? "navbar__link--active" : ""}`
                            }
                        >
                            <CirclePlus
                                className="navbar__link-icon"
                                size={18}
                                strokeWidth={2}
                            />
                            <span>Create Meal</span>
                        </NavLink>
                    </nav>
                ) : (
                    // Public Landing Navigation
                    <nav className="navbar__nav">
                        <a
                            href="/#home"
                            onClick={(e) => scrollToSection(e, "home")}
                            className={`navbar__link navbar__link--landing ${
                                activeSection === "home"
                                    ? "navbar__link--active"
                                    : ""
                            }`}
                        >
                            Home
                        </a>
                        <a
                            href="/#how-it-works"
                            onClick={(e) => scrollToSection(e, "how-it-works")}
                            className={`navbar__link navbar__link--landing ${
                                activeSection === "how-it-works"
                                    ? "navbar__link--active"
                                    : ""
                            }`}
                        >
                            How it works
                        </a>
                        <a
                            href="/#features"
                            onClick={(e) => scrollToSection(e, "features")}
                            className={`navbar__link navbar__link--landing ${
                                activeSection === "features"
                                    ? "navbar__link--active"
                                    : ""
                            }`}
                        >
                            Features
                        </a>
                    </nav>
                )}

                {/* Actions Area */}
                <div className="navbar__actions">
                    {user ? (
                        <div className="navbar__user" ref={dropdownRef}>
                            <button
                                type="button"
                                className="navbar__avatar-btn"
                                onClick={() =>
                                    setIsDropdownOpen((prev) => !prev)
                                }
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen}
                                title={user.email}
                            >
                                {getUserInitials(user)}
                            </button>

                            {isDropdownOpen && (
                                <div className="navbar__dropdown">
                                    <div className="navbar__dropdown-preview">
                                        <span className="navbar__dropdown-name">
                                            {getUserDisplayName(user)}
                                        </span>
                                        <span className="navbar__dropdown-email">
                                            {user.email}
                                        </span>
                                    </div>

                                    <hr className="navbar__dropdown-divider" />

                                    <Link
                                        to="/settings"
                                        className="navbar__dropdown-item"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <Settings size={16} strokeWidth={2} />
                                        <span>Settings</span>
                                    </Link>

                                    <button
                                        type="button"
                                        className="navbar__dropdown-item navbar__dropdown-item--danger"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} strokeWidth={2} />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
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
