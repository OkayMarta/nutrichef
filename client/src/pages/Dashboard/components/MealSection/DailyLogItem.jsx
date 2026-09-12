import { Pencil, Trash2 } from "lucide-react";

const DailyLogItem = ({ log, onEdit, onDelete }) => {
    if (!log) return null;

    const dishName = log.meal?.name || "Dish";
    const grams = log.consumedGrams || 0;
    const calories = Math.round(log.snapshotCalories || 0);
    const protein = Number(log.snapshotProtein || 0).toFixed(1);
    const fat = Number(log.snapshotFat || 0).toFixed(1);
    const carbs = Number(log.snapshotCarbs || 0).toFixed(1);

    return (
        <li className="meal-section__log-item">
            <div className="meal-section__log-main">
                <span className="meal-section__log-name">{dishName}</span>
                <span className="meal-section__log-weight">
                    {grams} g portion
                </span>
            </div>

            <div className="meal-section__log-meta">
                <div className="meal-section__log-macros">
                    <span className="macro-chip macro-chip--cal">
                        {calories} kcal
                    </span>
                    <span className="macro-chip macro-chip--p">
                        {protein}g P
                    </span>
                    <span className="macro-chip macro-chip--f">{fat}g F</span>
                    <span className="macro-chip macro-chip--c">{carbs}g C</span>
                </div>

                <div className="meal-section__log-actions">
                    {onEdit && (
                        <button
                            type="button"
                            className="meal-section__action-btn meal-section__action-btn--edit"
                            onClick={() => onEdit(log)}
                            aria-label={`Edit ${dishName} portion`}
                            title="Edit portion weight"
                        >
                            <Pencil size={15} strokeWidth={2} />
                        </button>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            className="meal-section__action-btn meal-section__action-btn--delete"
                            onClick={() => onDelete(log)}
                            aria-label={`Remove ${dishName}`}
                            title="Remove meal entry"
                        >
                            <Trash2 size={15} strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
};

export default DailyLogItem;
