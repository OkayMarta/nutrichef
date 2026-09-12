import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MealSearchBar.scss";

const MealSearchBar = ({
    value,
    onChange,
    totalCount,
    loading,
    placeholder = "Search meals by name...",
}) => {
    const [inputValue, setInputValue] = useState(value || "");
    const [prevValue, setPrevValue] = useState(value || "");

    // Sync input value if parent changes value externally without synchronous effect setState
    if (value !== prevValue) {
        setPrevValue(value);
        setInputValue(value || "");
    }

    // Debounce input changes by 350ms
    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        }, 350);

        return () => clearTimeout(handler);
    }, [inputValue, onChange, value]);

    const handleClear = () => {
        setInputValue("");
        onChange("");
    };

    return (
        <div className="meal-search-bar">
            {/* Search Input Box */}
            <div className="meal-search-bar__input-group">
                <span className="meal-search-bar__icon" aria-hidden="true">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>

                <input
                    type="text"
                    className="meal-search-bar__input"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    aria-label="Search meals"
                />

                {inputValue && (
                    <button
                        type="button"
                        className="meal-search-bar__clear-btn"
                        onClick={handleClear}
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        &times;
                    </button>
                )}

                {loading && (
                    <span
                        className="meal-search-bar__spinner"
                        aria-label="Searching..."
                    />
                )}
            </div>

            {/* Right Side: Counter & Action */}
            <div className="meal-search-bar__actions">
                <span className="meal-search-bar__counter">
                    {totalCount} {totalCount === 1 ? "meal" : "meals"}
                </span>

                <Link
                    to="/calculator"
                    className="btn btn--primary meal-search-bar__add-btn"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Create Meal</span>
                </Link>
            </div>
        </div>
    );
};

export default MealSearchBar;
