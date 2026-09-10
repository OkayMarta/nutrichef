const CreateMeal = () => {
    return (
        <div
            className="container"
            style={{ padding: "32px 20px 60px", maxWidth: "720px" }}
        >
            <div className="card">
                <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
                    Create Meal & Calculator
                </h1>
                <p style={{ marginBottom: "24px" }}>
                    Calculate nutritional values per 100g based on raw
                    ingredients and cooked weight.
                </p>

                <div
                    style={{
                        padding: "32px",
                        border: "1px dashed var(--color-border-dashed, #d2dfca)",
                        borderRadius: "16px",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            fontSize: "1.1rem",
                            fontWeight: "500",
                            marginBottom: "8px",
                        }}
                    >
                        🍳 Meal Calculator Form Coming Soon
                    </p>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        This page will allow adding ingredients, computing
                        cooked macros, and saving meals.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateMeal;
