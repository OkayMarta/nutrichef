import { Info } from "lucide-react";
import "./MealSummaryCard.scss";

const MealSummaryCard = ({
    name,
    caloriesPer100g,
    proteinPer100g,
    fatPer100g,
    carbsPer100g,
    hasValidWeight,
}) => {
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

            {/* Dish Title */}
            <div className="meal-summary-card__identity">
                <h3 className="meal-summary-card__title">
                    {name?.trim() || "Untitled Dish"}
                </h3>
            </div>

            {/* 4 Macro Cards Grid */}
            <div className="meal-summary-card__grid">
                {/* Calories Card */}
                <div className="meal-summary-card__macro meal-summary-card__macro--calories">
                    <div className="meal-summary-card__macro-header">
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

            {/* Explanatory Storage Notice */}
            <div className="meal-summary-card__notice">
                <Info size={16} className="meal-summary-card__notice-icon" />
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
