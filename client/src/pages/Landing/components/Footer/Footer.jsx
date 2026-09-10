import { Link } from "react-router-dom";
import LeafIcon from "../../../../components/common/LeafIcon";
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
                        <LeafIcon width={20} height={20} color="#74bd57" />
                    </span>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
