import { useMemo } from "react";
import { calculateCalorieDistribution } from "../../../../utils/nutrition";
import "./MealCard.scss";

const MealCard = ({ meal, onEdit, onDelete }) => {
    const {
        name,
        caloriesPer100g,
        proteinPer100g,
        fatPer100g,
        carbsPer100g,
        createdAt,
    } = meal;

    const formattedDate = useMemo(() => {
        if (!createdAt) return "";
        try {
            return new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "";
        }
    }, [createdAt]);

    const macroStats = useMemo(
        () =>
            calculateCalorieDistribution(
                proteinPer100g,
                fatPer100g,
                carbsPer100g,
            ),
        [proteinPer100g, fatPer100g, carbsPer100g],
    );

    return (
        <article className="meal-card">
            {/* Card Header: Name & Date */}
            <div className="meal-card__header">
                <div className="meal-card__title-group">
                    <h3 className="meal-card__title" title={name}>
                        {name}
                    </h3>
                    {formattedDate && (
                        <span className="meal-card__date">
                            Added {formattedDate}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="meal-card__actions">
                    <button
                        type="button"
                        className="meal-card__action-btn meal-card__action-btn--edit"
                        onClick={() => onEdit(meal)}
                        aria-label={`Edit ${name}`}
                        title="Edit meal"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        className="meal-card__action-btn meal-card__action-btn--delete"
                        onClick={() => onDelete(meal)}
                        aria-label={`Delete ${name}`}
                        title="Delete meal"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Serving Tag */}
            <div className="meal-card__serving-badge">
                <span>Per 100 g serving</span>
            </div>

            {/* Macro Tags Grid */}
            <div className="meal-card__macros">
                {/* Calories */}
                <div className="meal-card__macro-tag meal-card__macro-tag--calories">
                    <div className="meal-card__macro-data">
                        <div className="meal-card__macro-value-row">
                            <span className="meal-card__macro-val">
                                {Number(caloriesPer100g || 0).toFixed(1)}
                            </span>
                            <span className="meal-card__macro-unit">kcal</span>
                        </div>
                        <span className="meal-card__macro-label">Calories</span>
                    </div>
                </div>

                {/* Protein */}
                <div className="meal-card__macro-tag meal-card__macro-tag--protein">
                    <div className="meal-card__macro-data">
                        <div className="meal-card__macro-value-row">
                            <span className="meal-card__macro-val">
                                {Number(proteinPer100g || 0).toFixed(1)}
                            </span>
                            <span className="meal-card__macro-unit">g</span>
                        </div>
                        <span className="meal-card__macro-label">Protein</span>
                    </div>
                </div>

                {/* Fat */}
                <div className="meal-card__macro-tag meal-card__macro-tag--fat">
                    <div className="meal-card__macro-data">
                        <div className="meal-card__macro-value-row">
                            <span className="meal-card__macro-val">
                                {Number(fatPer100g || 0).toFixed(1)}
                            </span>
                            <span className="meal-card__macro-unit">g</span>
                        </div>
                        <span className="meal-card__macro-label">Fat</span>
                    </div>
                </div>

                {/* Carbs */}
                <div className="meal-card__macro-tag meal-card__macro-tag--carbs">
                    <div className="meal-card__macro-data">
                        <div className="meal-card__macro-value-row">
                            <span className="meal-card__macro-val">
                                {Number(carbsPer100g || 0).toFixed(1)}
                            </span>
                            <span className="meal-card__macro-unit">g</span>
                        </div>
                        <span className="meal-card__macro-label">Carbs</span>
                    </div>
                </div>
            </div>

            {/* Macro Proportion Legend */}
            {macroStats.hasData && (
                <div className="meal-card__ratio">
                    <div className="meal-card__ratio-legend">
                        <span>Protein {macroStats.pPct}%</span>
                        <span className="meal-card__ratio-dot">&middot;</span>
                        <span>Fat {macroStats.fPct}%</span>
                        <span className="meal-card__ratio-dot">&middot;</span>
                        <span>Carbs {macroStats.cPct}%</span>
                    </div>
                </div>
            )}
        </article>
    );
};

export default MealCard;
