import { Link } from "react-router-dom";

const Register = () => {
    return (
        <div
            className="container"
            style={{ padding: "60px 20px", maxWidth: "440px" }}
        >
            <div className="card">
                <h1
                    style={{
                        fontSize: "1.8rem",
                        marginBottom: "8px",
                        textAlign: "center",
                    }}
                >
                    Create an account
                </h1>
                <p style={{ textAlign: "center", marginBottom: "28px" }}>
                    Start tracking cooked meals accurately
                </p>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                marginBottom: "6px",
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--color-border)",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                marginBottom: "6px",
                            }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--color-border)",
                                outline: "none",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary"
                        style={{ width: "100%", marginTop: "8px" }}
                    >
                        Get started
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "24px",
                        fontSize: "0.9rem",
                    }}
                >
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "var(--color-brand-dark)",
                            fontWeight: "600",
                        }}
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
