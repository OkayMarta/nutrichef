import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import "./ErrorBoundary.scss";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            "Uncaught runtime error caught by ErrorBoundary:",
            error,
            errorInfo,
        );
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary__card">
                        <div className="error-boundary__icon-wrap">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="error-boundary__title">
                            Something went wrong
                        </h2>
                        <p className="error-boundary__message">
                            An unexpected application error occurred. You can
                            reload the page or navigate back to the home screen.
                        </p>
                        <div className="error-boundary__actions">
                            <button
                                type="button"
                                className="error-boundary__btn error-boundary__btn--primary"
                                onClick={this.handleReload}
                            >
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <RefreshCw size={16} />
                                    Reload Page
                                </span>
                            </button>
                            <button
                                type="button"
                                className="error-boundary__btn error-boundary__btn--secondary"
                                onClick={this.handleReset}
                            >
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    <Home size={16} />
                                    Return Home
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
