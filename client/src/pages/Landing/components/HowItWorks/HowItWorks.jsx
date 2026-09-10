import "./HowItWorks.scss";

const HowItWorks = () => {
    const steps = [
        {
            num: 1,
            title: "Add ingredients",
            desc: "Enter all the ingredients in your calorie app.",
            icon: (
                // Carrot icon
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7z" />
                    <path d="M15 9l5-5" />
                    <path d="M18 4l2 2" />
                    <path d="M20 2l2 2" />
                    <path d="M9 15l2 2" />
                </svg>
            ),
            hasArrow: true,
        },
        {
            num: 2,
            title: "Enter dish data",
            desc: "In our app, add the total calories and macros, plus the final cooked weight.",
            icon: (
                // Cooking Pot icon
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 11h18v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7z" />
                    <path d="M2 11h20" />
                    <path d="M4 7c3 0 5 4 8 4s5-4 8-4" />
                    <line x1="12" y1="3" x2="12" y2="7" />
                </svg>
            ),
            hasArrow: true,
        },
        {
            num: 3,
            title: "Get the result",
            desc: "We'll calculate the nutritional value per 100 g of your dish (calories, protein, fats, carbs).",
            icon: (
                // Calculator icon
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x="4" y="2" width="16" height="20" rx="3" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <circle cx="8.5" cy="11.5" r="1" fill="currentColor" />
                    <circle cx="12" cy="11.5" r="1" fill="currentColor" />
                    <circle cx="15.5" cy="11.5" r="1" fill="currentColor" />
                    <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
                    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
                    <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
                </svg>
            ),
            hasArrow: true,
        },
        {
            num: 4,
            title: "Save & track",
            desc: "Save the dish to your database and log how much you eat. The app will calculate the nutritional value for your portion.",
            icon: (
                // Bookmark / ribbon icon
                <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="7" x2="12" y2="13" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                </svg>
            ),
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
                        <h3 className="how-it-works__step-title">
                            {step.title}
                        </h3>
                        <p className="how-it-works__step-desc">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
