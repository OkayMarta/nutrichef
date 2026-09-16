import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
    House,
    BookMarked,
    CirclePlus,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
    getUserDisplayName,
    getUserInitials,
    getUserAvatarUrl,
} from "../../../utils/user";
import "./Navbar.scss";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isManualScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

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

    // Close mobile menu on browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => setIsMobileMenuOpen(false);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    // Keyboard ESC listener and scroll lock for mobile menu
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

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

    const lockScrollSpy = () => {
        isManualScrollingRef.current = true;
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        const unlockScroll = () => {
            isManualScrollingRef.current = false;
            window.removeEventListener("scrollend", unlockScroll);
        };

        window.addEventListener("scrollend", unlockScroll, { once: true });
        scrollTimeoutRef.current = setTimeout(unlockScroll, 1200);
    };

    // Listen for footer or external section scroll requests
    useEffect(() => {
        const handleExternalScroll = (e) => {
            const sectionId = e.detail;
            if (sectionId) {
                setActiveSection(sectionId);
                lockScrollSpy();
            }
        };

        window.addEventListener(
            "nutrichef:scroll-to-section",
            handleExternalScroll,
        );
        return () => {
            window.removeEventListener(
                "nutrichef:scroll-to-section",
                handleExternalScroll,
            );
        };
    }, []);

    const scrollToSection = (e, sectionId) => {
        if (e) e.preventDefault();
        setActiveSection(sectionId);

        if (location.pathname !== "/") {
            navigate(`/#${sectionId === "home" ? "" : sectionId}`);
            return;
        }

        // Lock scroll spy to prevent back-and-forth blinking during smooth scroll
        lockScrollSpy();

        if (sectionId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    const handleMobileSectionClick = (e, sectionId) => {
        scrollToSection(e, sectionId);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        logout();
        toast.info("You have been logged out.");
        navigate("/login");
    };

    const handleBrandClick = (e) => {
        setIsMobileMenuOpen(false);
        if (user) {
            // Authenticated user navigates to /dashboard
            return;
        }

        // Unauthenticated user: smoothly scroll to top and switch active tab to Home immediately
        if (location.pathname === "/") {
            scrollToSection(e, "home");
        }
    };

    return (
        <header className="navbar">
            <div className="navbar__container">
                {/* Brand Logo */}
                <Link
                    to={user ? "/dashboard" : "/"}
                    onClick={handleBrandClick}
                    className="navbar__brand"
                >
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

                {/* Desktop Actions Area */}
                <div className="navbar__actions">
                    {user ? (
                        <div
                            className="navbar__user"
                            ref={dropdownRef}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
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
                                {getUserAvatarUrl(user) ? (
                                    <img
                                        src={getUserAvatarUrl(user)}
                                        alt={getUserDisplayName(user)}
                                        className="navbar__avatar-img"
                                        onError={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                            const fallback =
                                                e.currentTarget.parentElement?.querySelector(
                                                    ".navbar__avatar-fallback",
                                                );
                                            if (fallback)
                                                fallback.style.display = "flex";
                                        }}
                                    />
                                ) : (
                                    getUserInitials(user)
                                )}
                                <span
                                    className="navbar__avatar-fallback"
                                    style={{ display: "none" }}
                                >
                                    {getUserInitials(user)}
                                </span>
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

                {/* Mobile Burger Toggle Button */}
                <button
                    type="button"
                    className="navbar__burger-btn"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? (
                        <X size={24} strokeWidth={2.2} />
                    ) : (
                        <Menu size={24} strokeWidth={2.2} />
                    )}
                </button>
            </div>

            {/* Mobile Drawer Overlay Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="navbar__mobile-backdrop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Drawer Menu */}
            <div
                className={`navbar__mobile-drawer ${
                    isMobileMenuOpen ? "navbar__mobile-drawer--open" : ""
                }`}
            >
                {user ? (
                    <div className="navbar__mobile-nav">
                        <div className="navbar__mobile-user">
                            <span className="navbar__mobile-user-name">
                                {getUserDisplayName(user)}
                            </span>
                            <span className="navbar__mobile-user-email">
                                {user.email}
                            </span>
                        </div>

                        <hr className="navbar__mobile-divider" />

                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `navbar__mobile-link ${
                                    isActive
                                        ? "navbar__mobile-link--active"
                                        : ""
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <House size={18} strokeWidth={2} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink
                            to="/meals"
                            className={({ isActive }) =>
                                `navbar__mobile-link ${
                                    isActive
                                        ? "navbar__mobile-link--active"
                                        : ""
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <BookMarked size={18} strokeWidth={2} />
                            <span>Saved Meals</span>
                        </NavLink>
                        <NavLink
                            to="/calculator"
                            className={({ isActive }) =>
                                `navbar__mobile-link ${
                                    isActive
                                        ? "navbar__mobile-link--active"
                                        : ""
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <CirclePlus size={18} strokeWidth={2} />
                            <span>Create Meal</span>
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `navbar__mobile-link ${
                                    isActive
                                        ? "navbar__mobile-link--active"
                                        : ""
                                }`
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Settings size={18} strokeWidth={2} />
                            <span>Settings</span>
                        </NavLink>

                        <hr className="navbar__mobile-divider" />

                        <button
                            type="button"
                            className="navbar__mobile-link navbar__mobile-link--danger"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                        >
                            <LogOut size={18} strokeWidth={2} />
                            <span>Log out</span>
                        </button>
                    </div>
                ) : (
                    <div className="navbar__mobile-nav">
                        <a
                            href="/#home"
                            onClick={(e) => handleMobileSectionClick(e, "home")}
                            className={`navbar__mobile-link ${
                                activeSection === "home"
                                    ? "navbar__mobile-link--active"
                                    : ""
                            }`}
                        >
                            Home
                        </a>
                        <a
                            href="/#how-it-works"
                            onClick={(e) =>
                                handleMobileSectionClick(e, "how-it-works")
                            }
                            className={`navbar__mobile-link ${
                                activeSection === "how-it-works"
                                    ? "navbar__mobile-link--active"
                                    : ""
                            }`}
                        >
                            How it works
                        </a>
                        <a
                            href="/#features"
                            onClick={(e) =>
                                handleMobileSectionClick(e, "features")
                            }
                            className={`navbar__mobile-link ${
                                activeSection === "features"
                                    ? "navbar__mobile-link--active"
                                    : ""
                            }`}
                        >
                            Features
                        </a>

                        <hr className="navbar__mobile-divider" />

                        <div className="navbar__mobile-actions">
                            <Link
                                to="/login"
                                className="btn btn--secondary navbar__mobile-btn"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn--primary navbar__mobile-btn"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get started &rarr;
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
