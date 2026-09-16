import { Scale, Calculator, Sparkles, BookOpen } from "lucide-react";
import "./HowItWorks.scss";

const HowItWorks = () => {
    const steps = [
        {
            num: 1,
            title: "Cook & weigh",
            desc: "Weigh your finished dish after cooking to accurately account for water loss, boiling, or reduction.",
            icon: <Scale size={30} strokeWidth={1.8} />,
            hasArrow: true,
        },
        {
            num: 2,
            title: "Enter dish details",
            desc: "In our calculator, enter the final cooked weight along with total calories and macros of all ingredients.",
            icon: <Calculator size={30} strokeWidth={1.8} />,
            hasArrow: true,
        },
        {
            num: 3,
            title: "Get 100 g profile",
            desc: "NutriChef instantly calculates the exact nutrition per 100 g and saves the dish to your recipe book.",
            icon: <Sparkles size={30} strokeWidth={1.8} />,
            hasArrow: true,
        },
        {
            num: 4,
            title: "Log to diary",
            desc: "Add any eaten portion to your daily diary — the app automatically scales calories and macros to your plate.",
            icon: <BookOpen size={30} strokeWidth={1.8} />,
            hasArrow: false,
        },
    ];

    return (
        <section id="how-it-works" className="how-it-works container">
            <div className="how-it-works__header">
                <span className="how-it-works__tag">How It Works</span>
                <h2 className="how-it-works__title">
                    From ingredients <br />
                    to your plate — in a few steps
                </h2>
                <p className="how-it-works__subtitle">
                    Our app helps you calculate the nutritional value of your
                    finished dishes and keep everything organized.
                </p>
            </div>

            <div className="how-it-works__steps">
                {steps.map((step) => (
                    <div key={step.num} className="how-it-works__step">
                        <div className="how-it-works__step-top">
                            <div className="how-it-works__badge">
                                {step.num}
                            </div>
                            <div className="how-it-works__icon-wrap">
                                {step.icon}
                            </div>
                            {step.hasArrow && (
                                <div className="how-it-works__arrow">
                                    &rarr;
                                </div>
                            )}
                        </div>
                        <div className="how-it-works__step-content">
                            <h3 className="how-it-works__step-title">
                                {step.title}
                            </h3>
                            <p className="how-it-works__step-desc">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
