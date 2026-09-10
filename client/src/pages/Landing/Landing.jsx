import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div
            className="landing-page container"
            style={{ padding: "40px 20px 80px" }}
        >
            {/* Hero Section */}
            <section
                style={{
                    textAlign: "center",
                    maxWidth: "780px",
                    margin: "0 auto 80px",
                }}
            >
                <span
                    className="badge badge--green"
                    style={{ marginBottom: "18px" }}
                >
                    Your personal nutrition helper
                </span>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3.2rem)",
                        lineHeight: "1.2",
                        marginBottom: "20px",
                    }}
                >
                    Know the nutrition of your home-cooked meals
                </h1>
                <p
                    style={{
                        fontSize: "1.15rem",
                        lineHeight: "1.6",
                        marginBottom: "32px",
                    }}
                >
                    Calculate calories, protein, fats and carbs for your
                    finished dishes. Save your recipes, track your portions and
                    make your nutrition easier.
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    <Link
                        to="/register"
                        className="btn btn--primary"
                        style={{ padding: "12px 28px", fontSize: "1.05rem" }}
                    >
                        Get started &rarr;
                    </Link>
                    <a
                        href="#how-it-works"
                        className="btn btn--secondary"
                        style={{ padding: "12px 28px", fontSize: "1.05rem" }}
                    >
                        Learn more
                    </a>
                </div>
            </section>

            {/* How it Works Section */}
            <section
                id="how-it-works"
                className="card"
                style={{ marginBottom: "40px", padding: "40px" }}
            >
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <span
                        style={{
                            fontSize: "0.85rem",
                            fontWeight: "700",
                            letterSpacing: "0.08em",
                            color: "var(--color-brand-dark)",
                            textTransform: "uppercase",
                        }}
                    >
                        How It Works
                    </span>
                    <h2 style={{ fontSize: "2rem", marginTop: "8px" }}>
                        From ingredients to your plate — in a few steps
                    </h2>
                    <p style={{ marginTop: "8px" }}>
                        Our app helps you calculate the nutritional value of
                        your finished dishes.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "24px",
                    }}
                >
                    <div style={{ textAlign: "center", padding: "16px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "#eaf4e3",
                                color: "#367d2e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 12px",
                                fontWeight: "bold",
                            }}
                        >
                            1
                        </div>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                            Add ingredients
                        </h3>
                        <p style={{ fontSize: "0.9rem" }}>
                            Enter all the ingredients in your calorie app.
                        </p>
                    </div>
                    <div style={{ textAlign: "center", padding: "16px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "#eaf4e3",
                                color: "#367d2e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 12px",
                                fontWeight: "bold",
                            }}
                        >
                            2
                        </div>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                            Enter dish data
                        </h3>
                        <p style={{ fontSize: "0.9rem" }}>
                            Add total raw calories and macros, plus final cooked
                            weight.
                        </p>
                    </div>
                    <div style={{ textAlign: "center", padding: "16px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "#eaf4e3",
                                color: "#367d2e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 12px",
                                fontWeight: "bold",
                            }}
                        >
                            3
                        </div>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                            Get the result
                        </h3>
                        <p style={{ fontSize: "0.9rem" }}>
                            Accurately calculate values per 100g of cooked food.
                        </p>
                    </div>
                    <div style={{ textAlign: "center", padding: "16px" }}>
                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                background: "#eaf4e3",
                                color: "#367d2e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 12px",
                                fontWeight: "bold",
                            }}
                        >
                            4
                        </div>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                            Save & track
                        </h3>
                        <p style={{ fontSize: "0.9rem" }}>
                            Log portions in your daily nutrition diary.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="card"
                style={{
                    padding: "40px",
                    background: "var(--color-bg-subtle)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <span
                        style={{
                            fontSize: "0.85rem",
                            fontWeight: "700",
                            letterSpacing: "0.08em",
                            color: "var(--color-brand-dark)",
                            textTransform: "uppercase",
                        }}
                    >
                        Why NutriChef
                    </span>
                    <h2 style={{ fontSize: "2rem", marginTop: "8px" }}>
                        Simple. Convenient. Useful.
                    </h2>
                </div>
                <ul
                    style={{
                        maxWidth: "480px",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <li
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ color: "var(--color-brand-dark)" }}>
                            ✓
                        </span>{" "}
                        Accurate calculations for finished dishes
                    </li>
                    <li
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ color: "var(--color-brand-dark)" }}>
                            ✓
                        </span>{" "}
                        Save your favorite recipes & custom meals
                    </li>
                    <li
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ color: "var(--color-brand-dark)" }}>
                            ✓
                        </span>{" "}
                        Track daily portion calories and macros
                    </li>
                    <li
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ color: "var(--color-brand-dark)" }}>
                            ✓
                        </span>{" "}
                        Clean and intuitive interface
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default Landing;
