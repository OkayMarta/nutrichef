import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div
            className="container"
            style={{
                padding: "80px 20px",
                textAlign: "center",
                maxWidth: "520px",
            }}
        >
            <div className="card">
                <span
                    style={{
                        fontSize: "3rem",
                        display: "block",
                        marginBottom: "16px",
                    }}
                >
                    🍃
                </span>
                <h1 style={{ fontSize: "2.4rem", marginBottom: "12px" }}>
                    404
                </h1>
                <h2 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>
                    Page Not Found
                </h2>
                <p style={{ marginBottom: "24px" }}>
                    The page you are looking for doesn't exist or has been
                    moved.
                </p>
                <Link
                    to="/"
                    className="btn btn--primary"
                    style={{ display: "inline-flex" }}
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
