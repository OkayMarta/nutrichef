import {
    Coffee,
    UtensilsCrossed,
    CookingPot,
    Candy,
    Utensils,
    Plus,
} from "lucide-react";
import DailyLogItem from "./DailyLogItem";
import "./MealSection.scss";

const CATEGORY_META = {
    BREAKFAST: {
        themeClass: "meal-section--breakfast",
        IconComponent: Coffee,
    },
    LUNCH: {
        themeClass: "meal-section--lunch",
        IconComponent: UtensilsCrossed,
    },
    DINNER: {
        themeClass: "meal-section--dinner",
        IconComponent: CookingPot,
    },
    SNACK: {
        themeClass: "meal-section--snack",
        IconComponent: Candy,
    },
};

const MealSection = ({
    mealType,
    title,
    logs = [],
    totalCalories = 0,
    loading = false,
    onAddMeal,
    onEditLog,
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
                        <DailyLogItem
                            key={log.id}
                            log={log}
                            onEdit={onEditLog}
                            onDelete={onDeleteLog}
                        />
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
