import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Search,
    Coffee,
    UtensilsCrossed,
    CookingPot,
    Candy,
} from "lucide-react";
import { getMeals } from "../../../../api/mealApi";
import { createDailyLog } from "../../../../api/dailyLogApi";
import {
    blockInvalidNumberKeys,
    sanitizePositiveInteger,
} from "../../../../utils/inputSanitizers";
import "./AddLogModal.scss";

const MEAL_OPTIONS = [
    { key: "BREAKFAST", label: "Breakfast", Icon: Coffee },
    { key: "LUNCH", label: "Lunch", Icon: UtensilsCrossed },
    { key: "DINNER", label: "Dinner", Icon: CookingPot },
    { key: "SNACK", label: "Snacks", Icon: Candy },
];

const QUICK_PORTIONS = [100, 150, 200, 250, 300];

const AddLogModal = ({
    initialMealType = "BREAKFAST",
    activeDate,
    onClose,
    onLogCreated,
}) => {
    const [selectedMealType, setSelectedMealType] = useState(initialMealType);
    const [meals, setMeals] = useState([]);
    const [mealsLoading, setMealsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [consumedGrams, setConsumedGrams] = useState(150);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Close on Escape key & lock body scroll
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    // Fetch user's saved dishes
    useEffect(() => {
        let isCurrent = true;

        getMeals()
            .then((res) => {
                if (isCurrent) {
                    const list = res.data || [];
                    setMeals(list);
                    if (list.length > 0) {
                        setSelectedMeal(list[0]);
                    }
                }
            })
            .catch((err) => {
                if (isCurrent) {
                    console.error("Failed to fetch meals:", err);
                    toast.error("Could not load your saved recipes.");
                }
            })
            .finally(() => {
                if (isCurrent) {
                    setMealsLoading(false);
                }
            });

        return () => {
            isCurrent = false;
        };
    }, []);

    // Filter meals by search term
    const filteredMeals = useMemo(() => {
        if (!searchTerm.trim()) return meals;
        const query = searchTerm.toLowerCase().trim();
        return meals.filter((m) => m.name.toLowerCase().includes(query));
    }, [meals, searchTerm]);

    // Live portion nutrition math: (basePer100g * grams) / 100
    const portionNutrition = useMemo(() => {
        const grams = parseFloat(consumedGrams);
        if (!selectedMeal || isNaN(grams) || grams <= 0) {
            return { calories: 0, protein: 0, fat: 0, carbs: 0 };
        }
        const factor = grams / 100;
        return {
            calories: Number(
                ((selectedMeal.caloriesPer100g || 0) * factor).toFixed(1),
            ),
            protein: Number(
                ((selectedMeal.proteinPer100g || 0) * factor).toFixed(1),
            ),
            fat: Number(((selectedMeal.fatPer100g || 0) * factor).toFixed(1)),
            carbs: Number(
                ((selectedMeal.carbsPer100g || 0) * factor).toFixed(1),
            ),
        };
    }, [selectedMeal, consumedGrams]);

    const validate = () => {
        const errs = {};
        if (!selectedMeal) {
            errs.meal = "Please select a dish from your recipes";
        }
        const grams = parseFloat(consumedGrams);
        if (isNaN(grams) || grams <= 0) {
            errs.grams = "Portion weight must be greater than 0 grams";
        } else if (grams > 5000) {
            errs.grams = "Portion weight cannot exceed 5,000 grams";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);
            const payload = {
                mealId: selectedMeal.id,
                date: activeDate,
                mealType: selectedMealType,
                consumedGrams: parseFloat(consumedGrams),
            };

            const response = await createDailyLog(payload);
            const activeCategory = MEAL_OPTIONS.find(
                (m) => m.key === selectedMealType,
            );
            toast.success(
                `Added "${selectedMeal.name}" to ${activeCategory?.label || "diary"}!`,
            );
            onLogCreated(response.data);
            onClose();
        } catch (error) {
            console.error("Failed to log meal:", error);
            const message =
                error.response?.data?.message ||
                "Failed to log meal. Please try again.";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="add-log-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-log-title"
        >
            <div className="add-log-modal">
                {/* Modal Header */}
                <div className="add-log-modal__header">
                    <h2 id="add-log-title" className="add-log-modal__title">
                        Add to Diary
                    </h2>
                    <button
                        type="button"
                        className="add-log-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        &times;
                    </button>
                </div>

                <form
                    className="add-log-modal__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Meal Type Segmented Selector */}
                    <div className="add-log-modal__group">
                        <label className="add-log-modal__label">
                            Meal Category
                        </label>
                        <div className="add-log-modal__type-tabs">
                            {MEAL_OPTIONS.map(({ key, label, Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`add-log-modal__type-tab ${
                                        selectedMealType === key
                                            ? "add-log-modal__type-tab--active"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedMealType(key)}
                                >
                                    <Icon size={16} strokeWidth={2} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Dish Selection */}
                    <div className="add-log-modal__group">
                        <div className="add-log-modal__label-row">
                            <label
                                className="add-log-modal__label"
                                htmlFor="dish-search"
                            >
                                Choose Dish{" "}
                                <span className="add-log-modal__required">
                                    *
                                </span>
                            </label>
                            <Link
                                to="/calculator"
                                className="add-log-modal__link-btn"
                                onClick={onClose}
                            >
                                + Create New Dish
                            </Link>
                        </div>

                        {mealsLoading ? (
                            <div className="add-log-modal__loading-dish">
                                Loading saved dishes...
                            </div>
                        ) : meals.length === 0 ? (
                            <div className="add-log-modal__empty-dishes">
                                <p>
                                    You have not saved any dishes in your
                                    database yet.
                                </p>
                                <Link
                                    to="/calculator"
                                    className="btn btn--primary"
                                    onClick={onClose}
                                >
                                    Open Meal Calculator
                                </Link>
                            </div>
                        ) : (
                            <div className="add-log-modal__dish-select-wrap">
                                {/* Search filter input */}
                                <div className="add-log-modal__search-box">
                                    <Search
                                        size={16}
                                        className="add-log-modal__search-icon"
                                    />
                                    <input
                                        id="dish-search"
                                        type="text"
                                        className="add-log-modal__search-input"
                                        placeholder="Filter by name..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            className="add-log-modal__clear-search"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>

                                {/* Dishes Picker List */}
                                <div className="add-log-modal__dish-list">
                                    {filteredMeals.map((meal) => {
                                        const isSelected =
                                            selectedMeal?.id === meal.id;
                                        return (
                                            <div
                                                key={meal.id}
                                                className={`add-log-modal__dish-item ${
                                                    isSelected
                                                        ? "add-log-modal__dish-item--selected"
                                                        : ""
                                                }`}
                                                onClick={() => {
                                                    setSelectedMeal(meal);
                                                    if (errors.meal) {
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            meal: undefined,
                                                        }));
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        e.preventDefault();
                                                        setSelectedMeal(meal);
                                                    }
                                                }}
                                            >
                                                <div className="add-log-modal__dish-main">
                                                    <span className="add-log-modal__dish-radio" />
                                                    <span className="add-log-modal__dish-name">
                                                        {meal.name}
                                                    </span>
                                                </div>
                                                <span className="add-log-modal__dish-badge">
                                                    {Math.round(
                                                        meal.caloriesPer100g ||
                                                            0,
                                                    )}{" "}
                                                    kcal / 100g
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {filteredMeals.length === 0 && (
                                        <div className="add-log-modal__no-matches">
                                            No recipes found matching &quot;
                                            {searchTerm}&quot;.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {errors.meal && (
                            <span className="add-log-modal__error-msg">
                                {errors.meal}
                            </span>
                        )}
                    </div>

                    {/* Step 2: Portion Weight in Grams */}
                    {selectedMeal && (
                        <div className="add-log-modal__group">
                            <label
                                className="add-log-modal__label"
                                htmlFor="portion-weight"
                            >
                                Consumed Weight (grams){" "}
                                <span className="add-log-modal__required">
                                    *
                                </span>
                            </label>

                            <div className="add-log-modal__input-wrapper">
                                <input
                                    id="portion-weight"
                                    type="number"
                                    step="1"
                                    min="1"
                                    max="5000"
                                    className={`add-log-modal__input ${
                                        errors.grams
                                            ? "add-log-modal__input--error"
                                            : ""
                                    }`}
                                    placeholder="e.g., 250"
                                    value={consumedGrams}
                                    onChange={(e) => {
                                        const clean = sanitizePositiveInteger(
                                            e.target.value,
                                            5000,
                                        );
                                        setConsumedGrams(clean);
                                        if (errors.grams) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                grams: undefined,
                                            }));
                                        }
                                    }}
                                    onKeyDown={blockInvalidNumberKeys}
                                    required
                                />
                                <span className="add-log-modal__unit">g</span>
                            </div>

                            {/* Quick Portion Chips */}
                            <div className="add-log-modal__quick-chips">
                                <span className="add-log-modal__chips-label">
                                    Quick:
                                </span>
                                {QUICK_PORTIONS.map((grams) => (
                                    <button
                                        key={grams}
                                        type="button"
                                        className={`add-log-modal__chip ${
                                            Number(consumedGrams) === grams
                                                ? "add-log-modal__chip--active"
                                                : ""
                                        }`}
                                        onClick={() => setConsumedGrams(grams)}
                                    >
                                        {grams}g
                                    </button>
                                ))}
                            </div>

                            {errors.grams && (
                                <span className="add-log-modal__error-msg">
                                    {errors.grams}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Step 3: Live Scaled Portion Nutrition Preview */}
                    {selectedMeal && (
                        <div className="add-log-modal__preview-box">
                            <div className="add-log-modal__preview-header">
                                <span className="add-log-modal__preview-title">
                                    Calculated for {Number(consumedGrams) || 0}
                                    &nbsp;g:
                                </span>
                            </div>

                            <div className="add-log-modal__preview-macros">
                                <div className="portion-chip portion-chip--cal">
                                    <span className="portion-chip__val">
                                        {portionNutrition.calories}
                                    </span>
                                    <span className="portion-chip__unit">
                                        kcal
                                    </span>
                                </div>
                                <div className="portion-chip portion-chip--p">
                                    <span className="portion-chip__val">
                                        {portionNutrition.protein}g
                                    </span>
                                    <span className="portion-chip__unit">
                                        Protein
                                    </span>
                                </div>
                                <div className="portion-chip portion-chip--f">
                                    <span className="portion-chip__val">
                                        {portionNutrition.fat}g
                                    </span>
                                    <span className="portion-chip__unit">
                                        Fat
                                    </span>
                                </div>
                                <div className="portion-chip portion-chip--c">
                                    <span className="portion-chip__val">
                                        {portionNutrition.carbs}g
                                    </span>
                                    <span className="portion-chip__unit">
                                        Carbs
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal Actions */}
                    <div className="add-log-modal__actions">
                        <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary add-log-modal__submit-btn"
                            disabled={submitting || meals.length === 0}
                        >
                            {submitting ? (
                                <>
                                    <span className="add-log-modal__spinner" />
                                    <span>Adding to Diary...</span>
                                </>
                            ) : (
                                "Add to Diary"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLogModal;
