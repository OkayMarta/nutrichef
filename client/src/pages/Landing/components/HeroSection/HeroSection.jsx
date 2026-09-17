import { Link } from "react-router-dom";
import LeafIcon from "../../../../components/common/LeafIcon";
import heroDashboardImg from "../../../../assets/dashboard-preview.png";
import "./HeroSection.scss";

const HeroSection = () => {
    return (
        <section id="home" className="hero-section container">
            {/* Ambient decorative leaves on the side for mobile */}
            <div
                className="hero-section__decor-leaf hero-section__decor-leaf--top"
                aria-hidden="true"
            >
                <LeafIcon width={54} height={54} color="#469c3c" />
            </div>
            <div
                className="hero-section__decor-leaf hero-section__decor-leaf--bottom"
                aria-hidden="true"
            >
                <LeafIcon width={76} height={76} color="#469c3c" />
            </div>

            <div className="hero-section__grid">
                <div className="hero-section__content">
                    <h1 className="hero-section__title">
                        Stop guessing calories in home-cooked dishes
                    </h1>

                    <p className="hero-section__subtitle">
                        Get accurate calories, protein, fats, and carbs
                        accounting for all ingredients, with the exact portion,
                        and track precisely what is on your plate.
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
                    <div className="hero-section__image-wrapper">
                        <div className="hero-section__image-backdrop" />
                        <img
                            src={heroDashboardImg}
                            alt="NutriChef Dashboard Preview"
                            className="hero-section__image"
                            loading="eager"
                        />
                        <LeafIcon
                            className="hero-section__image-leaf"
                            width={48}
                            height={48}
                            color="#469c3c"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
