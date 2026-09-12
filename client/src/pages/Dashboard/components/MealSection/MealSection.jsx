import { Sun, SunMedium, Moon, Utensils, Plus, Trash2 } from "lucide-react";
import "./MealSection.scss";

// Clean custom Cupcake icon matching the mockup image for Snacks
const CupcakeIcon = ({ size = 20, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5.5 11.5L7 20h10l1.5-8.5" />
        <path d="M4 11.5c0-1.8 1.4-2.8 3.2-2.8 1.6 0 2.5.8 4.8.8s3.2-.8 4.8-.8c1.8 0 3.2 1 3.2 2.8" />
        <circle cx="12" cy="5" r="1.5" />
    </svg>
);

const CATEGORY_META = {
    BREAKFAST: {
        themeClass: "meal-section--breakfast",
        IconComponent: Sun,
    },
    LUNCH: {
        themeClass: "meal-section--lunch",
        IconComponent: SunMedium,
    },
    DINNER: {
        themeClass: "meal-section--dinner",
        IconComponent: Moon,
    },
    SNACK: {
        themeClass: "meal-section--snack",
        IconComponent: CupcakeIcon,
    },
};

const MealSection = ({
    mealType,
    title,
    logs = [],
    totalCalories = 0,
    loading = false,
    onAddMeal,
    onDeleteLog,
}) => {
    const meta = CATEGORY_META[mealType] || CATEGORY_META.BREAKFAST;
    const Icon = meta.IconComponent;

    return (
        <section className={`meal-section ${meta.themeClass}`}>
            {/* Header: Category Badge, Title, Calories & Add Button */}
            <div className="meal-section__header">
                <div className="meal-section__title-group">
                    <div className="meal-section__icon-badge">
                        <Icon size={20} strokeWidth={2} />
                    </div>
                    <div className="meal-section__text-group">
                        <h2 className="meal-section__title">{title}</h2>
                        <span className="meal-section__calories">
                            {loading ? (
                                <span className="meal-section__skeleton-cals" />
                            ) : (
                                `${Math.round(totalCalories)} kcal`
                            )}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    className="meal-section__add-btn"
                    onClick={() => onAddMeal(mealType)}
                    aria-label={`Add meal to ${title}`}
                >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Add meal</span>
                </button>
            </div>

            {/* Content: Skeleton, Populated Log List, or Dashed Empty State */}
            {loading ? (
                <div className="meal-section__skeleton-stack">
                    <div className="meal-section__skeleton-row" />
                </div>
            ) : logs.length > 0 ? (
                <ul className="meal-section__log-list">
                    {logs.map((log) => (
                        <li key={log.id} className="meal-section__log-item">
                            <div className="meal-section__log-main">
                                <span className="meal-section__log-name">
                                    {log.meal?.name || "Dish"}
                                </span>
                                <span className="meal-section__log-weight">
                                    {log.consumedGrams} g portion
                                </span>
                            </div>

                            <div className="meal-section__log-meta">
                                <div className="meal-section__log-macros">
                                    <span className="macro-chip macro-chip--cal">
                                        {Math.round(log.snapshotCalories || 0)}{" "}
                                        kcal
                                    </span>
                                    <span className="macro-chip macro-chip--p">
                                        {Number(
                                            log.snapshotProtein || 0,
                                        ).toFixed(1)}
                                        g P
                                    </span>
                                    <span className="macro-chip macro-chip--f">
                                        {Number(log.snapshotFat || 0).toFixed(
                                            1,
                                        )}
                                        g F
                                    </span>
                                    <span className="macro-chip macro-chip--c">
                                        {Number(log.snapshotCarbs || 0).toFixed(
                                            1,
                                        )}
                                        g C
                                    </span>
                                </div>

                                {onDeleteLog && (
                                    <button
                                        type="button"
                                        className="meal-section__delete-btn"
                                        onClick={() => onDeleteLog(log.id)}
                                        aria-label={`Remove ${log.meal?.name || "meal"}`}
                                        title="Remove meal entry"
                                    >
                                        <Trash2 size={15} strokeWidth={2} />
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                /* Dashed Empty State Container matching mockup */
                <div
                    className="meal-section__empty"
                    onClick={() => onAddMeal(mealType)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onAddMeal(mealType);
                        }
                    }}
                    aria-label={`No meal added to ${title}. Click to add meal.`}
                >
                    <span
                        className="meal-section__empty-icon"
                        aria-hidden="true"
                    >
                        <Utensils size={24} strokeWidth={1.8} />
                    </span>
                    <div className="meal-section__empty-text-wrap">
                        <span className="meal-section__empty-title">
                            No meal added
                        </span>
                        <span className="meal-section__empty-desc">
                            Add your meal to track calories and macros.
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MealSection;
