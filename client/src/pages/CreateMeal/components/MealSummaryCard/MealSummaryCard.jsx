import { useMemo } from "react";
import { calculateCalorieDistribution } from "../../../../utils/nutrition";
import "./MealSummaryCard.scss";

const MealSummaryCard = ({
    name,
    totalWeight,
    caloriesPer100g,
    proteinPer100g,
    fatPer100g,
    carbsPer100g,
    hasValidWeight,
}) => {
    // Macro calories calculation for proportion bar
    const macroStats = useMemo(
        () =>
            calculateCalorieDistribution(
                proteinPer100g,
                fatPer100g,
                carbsPer100g,
            ),
        [proteinPer100g, fatPer100g, carbsPer100g],
    );

    const formatValue = (val) => {
        if (!hasValidWeight) return "--";
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <div className="meal-summary-card">
            {/* Header Badge */}
            <div className="meal-summary-card__top">
                <span className="meal-summary-card__badge">
                    <span className="meal-summary-card__badge-pulse" />
                    Live Preview
                </span>
                <span className="meal-summary-card__serving-tag">
                    Values per 100 g
                </span>
            </div>

            {/* Dish Title & Cooked Weight */}
            <div className="meal-summary-card__identity">
                <h3 className="meal-summary-card__title">
                    {name?.trim() || "Untitled Dish"}
                </h3>
                <div className="meal-summary-card__weight-pill">
                    <span className="meal-summary-card__weight-icon">⚖️</span>
                    <span>
                        {hasValidWeight
                            ? `${Number(totalWeight).toLocaleString()} g total cooked`
                            : "Enter cooked weight"}
                    </span>
                </div>
            </div>

            {/* 4 Macro Cards Grid */}
            <div className="meal-summary-card__grid">
                {/* Calories Card */}
                <div className="meal-summary-card__macro meal-summary-card__macro--calories">
                    <div className="meal-summary-card__macro-header">
                        <span className="meal-summary-card__macro-icon">
                            🔥
                        </span>
                        <span className="meal-summary-card__macro-label">
                            Calories
                        </span>
                    </div>
                    <div className="meal-summary-card__macro-value-group">
                        <span className="meal-summary-card__macro-val">
                            {formatValue(caloriesPer100g)}
                        </span>
                        <span className="meal-summary-card__macro-unit">
                            kcal
                        </span>
                    </div>
                </div>

                {/* Protein Card */}
                <div className="meal-summary-card__macro meal-summary-card__macro--protein">
                    <div className="meal-summary-card__macro-header">
                        <span className="meal-summary-card__macro-icon">
                            🥩
                        </span>
                        <span className="meal-summary-card__macro-label">
                            Protein
                        </span>
                    </div>
                    <div className="meal-summary-card__macro-value-group">
                        <span className="meal-summary-card__macro-val">
                            {formatValue(proteinPer100g)}
                        </span>
                        <span className="meal-summary-card__macro-unit">g</span>
                    </div>
                </div>

                {/* Fat Card */}
                <div className="meal-summary-card__macro meal-summary-card__macro--fat">
                    <div className="meal-summary-card__macro-header">
                        <span className="meal-summary-card__macro-icon">
                            🥑
                        </span>
                        <span className="meal-summary-card__macro-label">
                            Fat
                        </span>
                    </div>
                    <div className="meal-summary-card__macro-value-group">
                        <span className="meal-summary-card__macro-val">
                            {formatValue(fatPer100g)}
                        </span>
                        <span className="meal-summary-card__macro-unit">g</span>
                    </div>
                </div>

                {/* Carbs Card */}
                <div className="meal-summary-card__macro meal-summary-card__macro--carbs">
                    <div className="meal-summary-card__macro-header">
                        <span className="meal-summary-card__macro-icon">
                            🌾
                        </span>
                        <span className="meal-summary-card__macro-label">
                            Carbs
                        </span>
                    </div>
                    <div className="meal-summary-card__macro-value-group">
                        <span className="meal-summary-card__macro-val">
                            {formatValue(carbsPer100g)}
                        </span>
                        <span className="meal-summary-card__macro-unit">g</span>
                    </div>
                </div>
            </div>

            {/* Macro Calorie Distribution Bar */}
            <div className="meal-summary-card__ratio-section">
                <div className="meal-summary-card__ratio-header">
                    <span>Calorie Distribution</span>
                    {macroStats.hasData && (
                        <div className="meal-summary-card__ratio-legend">
                            <span className="legend-item legend-item--protein">
                                P: {macroStats.pPct}%
                            </span>
                            <span className="legend-item legend-item--fat">
                                F: {macroStats.fPct}%
                            </span>
                            <span className="legend-item legend-item--carbs">
                                C: {macroStats.cPct}%
                            </span>
                        </div>
                    )}
                </div>

                <div className="meal-summary-card__ratio-bar">
                    {macroStats.hasData ? (
                        <>
                            <div
                                className="meal-summary-card__ratio-segment meal-summary-card__ratio-segment--protein"
                                style={{ width: `${macroStats.pPct}%` }}
                                title={`Protein: ${macroStats.pPct}%`}
                            />
                            <div
                                className="meal-summary-card__ratio-segment meal-summary-card__ratio-segment--fat"
                                style={{ width: `${macroStats.fPct}%` }}
                                title={`Fat: ${macroStats.fPct}%`}
                            />
                            <div
                                className="meal-summary-card__ratio-segment meal-summary-card__ratio-segment--carbs"
                                style={{ width: `${macroStats.cPct}%` }}
                                title={`Carbs: ${macroStats.cPct}%`}
                            />
                        </>
                    ) : (
                        <div className="meal-summary-card__ratio-segment meal-summary-card__ratio-segment--empty" />
                    )}
                </div>
            </div>

            {/* Explanatory Storage Notice */}
            <div className="meal-summary-card__notice">
                <span className="meal-summary-card__notice-icon">💡</span>
                <p className="meal-summary-card__notice-text">
                    <strong>Stored Base Profile:</strong> This profile is saved
                    per 100&nbsp;g. When you log this meal in your daily diary,
                    NutriChef will automatically scale calories and macros to
                    the exact weight you eat.
                </p>
            </div>
        </div>
    );
};

export default MealSummaryCard;
