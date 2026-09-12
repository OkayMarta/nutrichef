import { Link } from "react-router-dom";
import DashboardPreview from "../DashboardPreview/DashboardPreview";
import "./HeroSection.scss";

const HeroSection = () => {
    return (
        <section id="home" className="hero-section container">
            <div className="hero-section__grid">
                <div className="hero-section__content">
                    <h1 className="hero-section__title">
                        Stop guessing calories in home-cooked dishes
                    </h1>

                    <p className="hero-section__subtitle">
                        Calculate exact calories, protein, fats, and carbs
                        accounting for boiled grains, stews, and
                        multi-ingredient cooking. Log raw ingredients, weigh the
                        cooked portion, and track precisely what is on your
                        plate.
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
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById("how-it-works")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                    });
                            }}
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
