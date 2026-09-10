import { Link } from "react-router-dom";
import "./CtaBanner.scss";

const CtaBanner = () => {
    return (
        <section className="cta-banner container">
            <div className="cta-banner__card">
                <div className="cta-banner__left">
                    {/* Outline Leaf Icon */}
                    <svg
                        className="cta-banner__leaf-icon"
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

                    <div className="cta-banner__content">
                        <h2 className="cta-banner__title">
                            Ready to make your meals count?
                        </h2>
                        <p className="cta-banner__subtitle">
                            Join NutriChef and take control of your nutrition
                            today.
                        </p>
                    </div>
                </div>

                <div className="cta-banner__action">
                    <Link
                        to="/register"
                        className="btn btn--primary cta-banner__btn"
                    >
                        Get started &rarr;
                    </Link>
                </div>

                {/* Right Sprouting Salad Bowl Illustration matching mockup */}
                <svg
                    className="cta-banner__illustration"
                    viewBox="0 0 100 80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Bowl body */}
                    <path d="M15 38 Q50 75 85 38 Z" fill="none" />
                    <line x1="10" y1="38" x2="90" y2="38" strokeWidth="2" />
                    {/* Bowl foot */}
                    <path d="M35 60 L65 60" strokeWidth="2.5" />

                    {/* Sprouting herbs & leaves */}
                    <path d="M50 38 Q50 16 50 14" />
                    <path
                        d="M50 20 Q35 12 40 26 Q46 24 50 24"
                        fill="rgba(116, 189, 87, 0.2)"
                    />
                    <path
                        d="M50 20 Q65 12 60 26 Q54 24 50 24"
                        fill="rgba(116, 189, 87, 0.2)"
                    />
                    <path d="M30 38 Q25 24 38 30" />
                    <path d="M70 38 Q75 24 62 30" />
                </svg>
            </div>
        </section>
    );
};

export default CtaBanner;
