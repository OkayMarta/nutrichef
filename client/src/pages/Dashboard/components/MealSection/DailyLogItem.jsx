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
                <span className="meal-section__log-name" title={dishName}>
                    {dishName}
                </span>
                <span className="meal-section__log-weight">
                    {grams} g portion
                </span>
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

            <div className="meal-section__log-macros">
                <div className="macro-chip macro-chip--cal">
                    <span className="macro-chip__val">{calories} kcal</span>
                    <span className="macro-chip__lbl">Energy</span>
                </div>
                <div className="macro-chip macro-chip--p">
                    <span className="macro-chip__val">{protein} g</span>
                    <span className="macro-chip__lbl">Protein</span>
                </div>
                <div className="macro-chip macro-chip--f">
                    <span className="macro-chip__val">{fat} g</span>
                    <span className="macro-chip__lbl">Fat</span>
                </div>
                <div className="macro-chip macro-chip--c">
                    <span className="macro-chip__val">{carbs} g</span>
                    <span className="macro-chip__lbl">Carbs</span>
                </div>
            </div>
        </li>
    );
};

export default DailyLogItem;
