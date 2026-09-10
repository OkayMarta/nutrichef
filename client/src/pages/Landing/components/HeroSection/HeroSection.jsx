import { Link } from "react-router-dom";
import DashboardPreview from "../DashboardPreview/DashboardPreview";
import "./HeroSection.scss";

const HeroSection = () => {
    return (
        <section className="hero-section container">
            <div className="hero-section__grid">
                <div className="hero-section__content">
                    <span className="badge badge--green hero-section__badge">
                        Your personal nutrition helper
                    </span>

                    <h1 className="hero-section__title">
                        Know the nutrition <br />
                        of your home-cooked <br />
                        meals
                    </h1>

                    <p className="hero-section__subtitle">
                        Calculate calories, protein, fats and carbs for your
                        finished dishes. Save your recipes, track your portions
                        and make your nutrition easier.
                    </p>

                    <div className="hero-section__actions">
                        <Link
                            to="/register"
                            className="btn btn--primary hero-section__btn-cta"
                        >
                            Get started &rarr;
                        </Link>
                        <a
                            href="#how-it-works"
                            className="btn btn--secondary hero-section__btn-learn"
                        >
                            Learn more
                        </a>
                    </div>
                </div>

                <div className="hero-section__visual">
                    <DashboardPreview />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
