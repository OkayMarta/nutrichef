const SavedMeals = () => {
    return (
        <div className="container" style={{ padding: "32px 20px 60px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <div>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: "700" }}>
                        Saved Meals
                    </h1>
                    <p style={{ color: "var(--color-text-muted)" }}>
                        Manage your personal recipe and meal database
                    </p>
                </div>
            </div>

            <div
                className="card"
                style={{ textAlign: "center", padding: "48px 24px" }}
            >
                <p
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        marginBottom: "8px",
                    }}
                >
                    📖 No saved meals found
                </p>
                <p
                    style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.9rem",
                    }}
                >
                    Create and save meals using the meal calculator to see them
                    listed here.
                </p>
            </div>
        </div>
    );
};

export default SavedMeals;
