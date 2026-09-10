import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="landing-footer">
            <div className="landing-footer__container container">
                <Link to="/" className="landing-footer__brand">
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
                    <span>NutriChef</span>
                </Link>

                <nav className="landing-footer__nav">
                    <Link to="/">Home</Link>
                    <a href="#how-it-works">How it works</a>
                    <a href="#features">Features</a>
                    <span
                        className="landing-footer__leaf-icon"
                        aria-hidden="true"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                        </svg>
                    </span>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
