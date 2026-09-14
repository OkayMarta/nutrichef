import "./Footer.scss";

const Footer = () => {
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        if (sectionId === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    return (
        <footer className="landing-footer">
            <div className="landing-footer__container">
                {/* Brand Info */}
                <a
                    href="#home"
                    onClick={(e) => scrollToSection(e, "home")}
                    className="landing-footer__brand"
                >
                    <div className="landing-footer__logo-icon">
                        <img
                            src="/logo.svg"
                            alt="NutriChef Logo"
                            className="landing-footer__logo-img"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback =
                                    e.currentTarget.parentElement?.querySelector(
                                        ".landing-footer__logo-fallback",
                                    );
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                        <span
                            className="landing-footer__logo-fallback"
                            style={{ display: "none" }}
                        >
                            🍃
                        </span>
                    </div>
                    <div className="landing-footer__brand-text">
                        <span className="landing-footer__title">NutriChef</span>
                        <span className="landing-footer__tagline">
                            Calculate. Track. Eat Better.
                        </span>
                    </div>
                </a>

                {/* Center Navigation Links */}
                <nav
                    className="landing-footer__nav"
                    aria-label="Footer navigation"
                >
                    <a
                        href="#home"
                        onClick={(e) => scrollToSection(e, "home")}
                        className="landing-footer__link"
                    >
                        Home
                    </a>
                    <a
                        href="#how-it-works"
                        onClick={(e) => scrollToSection(e, "how-it-works")}
                        className="landing-footer__link"
                    >
                        How it works
                    </a>
                    <a
                        href="#features"
                        onClick={(e) => scrollToSection(e, "features")}
                        className="landing-footer__link"
                    >
                        Features
                    </a>
                </nav>

                {/* Right Area: GitHub & Copyright */}
                <div className="landing-footer__right">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="landing-footer__github-link"
                        aria-label="NutriChef GitHub repository (placeholder)"
                        title="GitHub"
                    >
                        <svg
                            className="landing-footer__github-icon"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            />
                        </svg>
                    </a>

                    <span
                        className="landing-footer__divider"
                        aria-hidden="true"
                    />

                    <span className="landing-footer__copyright">
                        &copy; 2026 NutriChef. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
