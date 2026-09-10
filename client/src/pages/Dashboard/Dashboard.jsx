import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="container" style={{ padding: "32px 20px 60px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>
                        Today
                    </h1>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        📅 {today}
                    </p>
                </div>
                {user && (
                    <span className="badge badge--green">
                        Signed in as {user.email}
                    </span>
                )}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "24px",
                }}
            >
                {/* Left Column: Meal Logs */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => (
                        <div
                            key={meal}
                            className="card"
                            style={{ padding: "20px" }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "16px",
                                }}
                            >
                                <div>
                                    <h3 style={{ fontSize: "1.1rem" }}>
                                        {meal}
                                    </h3>
                                    <span
                                        style={{
                                            fontSize: "0.85rem",
                                            color: "var(--color-text-muted)",
                                        }}
                                    >
                                        0 kcal
                                    </span>
                                </div>
                                <button type="button" className="btn btn--soft">
                                    + Add meal
                                </button>
                            </div>
                            <div
                                style={{
                                    border: "1px dashed var(--color-border-dashed, #d2dfca)",
                                    borderRadius: "12px",
                                    padding: "24px",
                                    textAlign: "center",
                                    color: "var(--color-text-muted)",
                                    fontSize: "0.9rem",
                                }}
                            >
                                🍴 No meal added. Add your meal to track
                                calories and macros.
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Summary & Daily Tip */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                    }}
                >
                    <div className="card" style={{ padding: "24px" }}>
                        <h3
                            style={{ fontSize: "1.2rem", marginBottom: "16px" }}
                        >
                            Daily Summary
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "16px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.9rem",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span>Calories</span>
                                    <span
                                        style={{
                                            color: "var(--color-macro-calories, #469c3c)",
                                            fontWeight: "600",
                                        }}
                                    >
                                        0 / 2000 kcal
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: "8px",
                                        borderRadius: "999px",
                                        background: "var(--color-border)",
                                    }}
                                ></div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.9rem",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span>Protein</span>
                                    <span
                                        style={{
                                            color: "var(--color-macro-protein, #2563eb)",
                                            fontWeight: "600",
                                        }}
                                    >
                                        0 / 120 g
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: "8px",
                                        borderRadius: "999px",
                                        background: "var(--color-border)",
                                    }}
                                ></div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.9rem",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span>Fat</span>
                                    <span
                                        style={{
                                            color: "var(--color-macro-fat, #e08b1a)",
                                            fontWeight: "600",
                                        }}
                                    >
                                        0 / 65 g
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: "8px",
                                        borderRadius: "999px",
                                        background: "var(--color-border)",
                                    }}
                                ></div>
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: "0.9rem",
                                        marginBottom: "4px",
                                    }}
                                >
                                    <span>Carbs</span>
                                    <span
                                        style={{
                                            color: "var(--color-macro-carbs, #8b5cf6)",
                                            fontWeight: "600",
                                        }}
                                    >
                                        0 / 250 g
                                    </span>
                                </div>
                                <div
                                    style={{
                                        height: "8px",
                                        borderRadius: "999px",
                                        background: "var(--color-border)",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="card"
                        style={{
                            padding: "24px",
                            background: "var(--color-bg-card-muted, #f4f8f1)",
                        }}
                    >
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>
                            Daily Tip
                        </h3>
                        <p
                            style={{
                                fontWeight: "600",
                                color: "var(--color-text-dark)",
                                marginBottom: "4px",
                            }}
                        >
                            Drink more water
                        </p>
                        <p style={{ fontSize: "0.85rem" }}>
                            Optimal hydration is essential for your health and
                            well-being.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
