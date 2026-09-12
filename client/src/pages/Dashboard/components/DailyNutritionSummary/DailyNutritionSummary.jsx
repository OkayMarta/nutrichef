import "./DailyNutritionSummary.scss";

const METRICS_CONFIG = [
    {
        key: "calories",
        label: "Calories",
        unit: "kcal",
        colorModifier: "calories",
        formatValue: (val) => Math.round(val),
        formatGoal: (val) => Math.round(val),
    },
    {
        key: "protein",
        label: "Protein",
        unit: "g",
        colorModifier: "protein",
        formatValue: (val) => Number(val).toFixed(1),
        formatGoal: (val) => Number(val).toFixed(0),
    },
    {
        key: "fat",
        label: "Fat",
        unit: "g",
        colorModifier: "fat",
        formatValue: (val) => Number(val).toFixed(1),
        formatGoal: (val) => Number(val).toFixed(0),
    },
    {
        key: "carbs",
        label: "Carbs",
        unit: "g",
        colorModifier: "carbs",
        formatValue: (val) => Number(val).toFixed(1),
        formatGoal: (val) => Number(val).toFixed(0),
    },
];

const DailyNutritionSummary = ({
    activeDate,
    totals = {},
    goals = {},
    loading = false,
}) => {
    return (
        <section
            className="dashboard-card daily-summary-card"
            aria-label="Daily Nutrition Summary"
        >
            <div className="daily-summary-card__header">
                <h2 className="daily-summary-card__title">
                    Daily Nutrition Summary
                </h2>
                {activeDate && (
                    <span className="daily-summary-card__date-pill">
                        {activeDate}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="daily-summary-card__skeleton-stack">
                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                </div>
            ) : (
                <div className="daily-summary-card__metrics">
                    {METRICS_CONFIG.map(
                        ({
                            key,
                            label,
                            unit,
                            colorModifier,
                            formatValue,
                            formatGoal,
                        }) => {
                            const current = totals[key] || 0;
                            const target = goals[key] || 0;
                            const isOverBudget = target > 0 && current > target;
                            const pct =
                                target > 0
                                    ? Math.round((current / target) * 100)
                                    : 0;
                            const visualWidth = Math.min(100, pct);

                            return (
                                <div
                                    key={key}
                                    className={`daily-summary-card__metric daily-summary-card__metric--${colorModifier} ${
                                        isOverBudget
                                            ? "daily-summary-card__metric--exceeded"
                                            : ""
                                    }`}
                                >
                                    <div className="daily-summary-card__metric-header">
                                        <span className="metric-label">
                                            {label}
                                        </span>
                                        <div className="metric-value-wrapper">
                                            <span className="metric-value">
                                                <strong>
                                                    {formatValue(current)}
                                                </strong>{" "}
                                                / {formatGoal(target)} {unit}
                                            </span>
                                            {isOverBudget && (
                                                <span
                                                    className="daily-summary-card__badge-exceeded"
                                                    title={`Exceeded goal by ${formatValue(
                                                        current - target,
                                                    )} ${unit} (${pct}%)`}
                                                >
                                                    {pct}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Linear Progress Bar */}
                                    <div
                                        className={`daily-summary-card__progress-track ${
                                            isOverBudget
                                                ? "daily-summary-card__progress-track--exceeded"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className={`daily-summary-card__progress-bar daily-summary-card__progress-bar--${colorModifier} ${
                                                isOverBudget
                                                    ? "daily-summary-card__progress-bar--exceeded"
                                                    : ""
                                            }`}
                                            style={{
                                                width: `${visualWidth}%`,
                                            }}
                                            role="progressbar"
                                            aria-valuenow={current}
                                            aria-valuemin={0}
                                            aria-valuemax={target}
                                            aria-label={`${label} progress`}
                                        />
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>
            )}
        </section>
    );
};

export default DailyNutritionSummary;
