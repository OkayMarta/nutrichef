import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Zap } from "lucide-react";
import "./MacroCalculatorModal.scss";

const ACTIVITY_LEVELS = [
    { label: "Sedentary (little or no exercise)", value: 1.2 },
    { label: "Lightly active (1-3 days/week)", value: 1.375 },
    { label: "Moderately active (3-5 days/week)", value: 1.55 },
    { label: "Very active (6-7 days/week)", value: 1.725 },
];

const GOAL_OPTIONS = [
    { label: "Weight Loss", value: "loss" },
    { label: "Maintenance", value: "maintain" },
    { label: "Muscle Gain", value: "gain" },
];

const MacroCalculatorModal = ({ isOpen, onClose, onApply }) => {
    const [form, setForm] = useState({
        gender: "male",
        age: "",
        weight: "",
        height: "",
        activityLevel: 1.55,
        goal: "maintain",
    });

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Mifflin-St Jeor calculation — derived from form state
    const results = useMemo(() => {
        const age = parseFloat(form.age);
        const weight = parseFloat(form.weight);
        const height = parseFloat(form.height);
        const activity = parseFloat(form.activityLevel);

        if (
            isNaN(age) ||
            age <= 0 ||
            isNaN(weight) ||
            weight <= 0 ||
            isNaN(height) ||
            height <= 0
        ) {
            return null;
        }

        // BMR: Mifflin-St Jeor
        let bmr;
        if (form.gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // TDEE
        let tdee = bmr * activity;

        // Goal adjustment
        if (form.goal === "loss") {
            tdee *= 0.82; // ~18% deficit
        } else if (form.goal === "gain") {
            tdee *= 1.12; // ~12% surplus
        }

        const calories = Math.round(tdee);

        // Macro split
        // Protein: ~2g per kg body weight
        const proteinGrams = Math.round(weight * 2);
        const proteinCalories = proteinGrams * 4;

        // Fat: ~27% of total calories
        const fatCalories = Math.round(calories * 0.27);
        const fatGrams = Math.round(fatCalories / 9);

        // Carbs: remaining calories
        const carbCalories = calories - proteinCalories - fatCalories;
        const carbGrams = Math.max(0, Math.round(carbCalories / 4));

        return {
            goalCalories: calories,
            goalProtein: proteinGrams,
            goalFat: fatGrams,
            goalCarbs: carbGrams,
        };
    }, [form]);

    // Escape key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleApply = () => {
        if (results) {
            onApply(results);
            onClose();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="macro-modal__backdrop" onClick={handleBackdropClick}>
            <div className="macro-modal" role="dialog" aria-modal="true">
                <div className="macro-modal__header">
                    <h2 className="macro-modal__title">
                        <Zap size={20} strokeWidth={2} />
                        <span>Recommended Goals Calculator</span>
                    </h2>
                    <button
                        type="button"
                        className="macro-modal__close"
                        onClick={onClose}
                        aria-label="Close calculator"
                    >
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>

                <div className="macro-modal__body">
                    {/* Gender */}
                    <fieldset className="macro-modal__fieldset">
                        <legend className="macro-modal__legend">Gender</legend>
                        <div className="macro-modal__radio-group">
                            <label className="macro-modal__radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={form.gender === "male"}
                                    onChange={(e) =>
                                        handleChange("gender", e.target.value)
                                    }
                                />
                                <span className="macro-modal__radio-text">
                                    Male
                                </span>
                            </label>
                            <label className="macro-modal__radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={form.gender === "female"}
                                    onChange={(e) =>
                                        handleChange("gender", e.target.value)
                                    }
                                />
                                <span className="macro-modal__radio-text">
                                    Female
                                </span>
                            </label>
                        </div>
                    </fieldset>

                    {/* Numeric Inputs */}
                    <div className="macro-modal__inputs-grid">
                        <div className="macro-modal__input-group">
                            <label
                                className="macro-modal__label"
                                htmlFor="calc-age"
                            >
                                Age (years)
                            </label>
                            <input
                                id="calc-age"
                                type="number"
                                min="1"
                                max="120"
                                className="macro-modal__input"
                                value={form.age}
                                onChange={(e) =>
                                    handleChange("age", e.target.value)
                                }
                                placeholder="25"
                            />
                        </div>
                        <div className="macro-modal__input-group">
                            <label
                                className="macro-modal__label"
                                htmlFor="calc-weight"
                            >
                                Weight (kg)
                            </label>
                            <input
                                id="calc-weight"
                                type="number"
                                min="1"
                                className="macro-modal__input"
                                value={form.weight}
                                onChange={(e) =>
                                    handleChange("weight", e.target.value)
                                }
                                placeholder="70"
                            />
                        </div>
                        <div className="macro-modal__input-group">
                            <label
                                className="macro-modal__label"
                                htmlFor="calc-height"
                            >
                                Height (cm)
                            </label>
                            <input
                                id="calc-height"
                                type="number"
                                min="1"
                                className="macro-modal__input"
                                value={form.height}
                                onChange={(e) =>
                                    handleChange("height", e.target.value)
                                }
                                placeholder="175"
                            />
                        </div>
                    </div>

                    {/* Selects */}
                    <div className="macro-modal__selects-grid">
                        <div className="macro-modal__input-group">
                            <label
                                className="macro-modal__label"
                                htmlFor="calc-activity"
                            >
                                Activity Level
                            </label>
                            <select
                                id="calc-activity"
                                className="macro-modal__select"
                                value={form.activityLevel}
                                onChange={(e) =>
                                    handleChange(
                                        "activityLevel",
                                        e.target.value,
                                    )
                                }
                            >
                                {ACTIVITY_LEVELS.map((level) => (
                                    <option
                                        key={level.value}
                                        value={level.value}
                                    >
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="macro-modal__input-group">
                            <label
                                className="macro-modal__label"
                                htmlFor="calc-goal"
                            >
                                Primary Goal
                            </label>
                            <select
                                id="calc-goal"
                                className="macro-modal__select"
                                value={form.goal}
                                onChange={(e) =>
                                    handleChange("goal", e.target.value)
                                }
                            >
                                {GOAL_OPTIONS.map((goal) => (
                                    <option key={goal.value} value={goal.value}>
                                        {goal.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results Preview */}
                    {results && (
                        <div className="macro-modal__results">
                            <h3 className="macro-modal__results-title">
                                Recommended Daily Targets
                            </h3>
                            <div className="macro-modal__results-grid">
                                <div className="macro-modal__result-pill macro-modal__result-pill--calories">
                                    <span className="macro-modal__result-value">
                                        {results.goalCalories}
                                    </span>
                                    <span className="macro-modal__result-label">
                                        kcal
                                    </span>
                                </div>
                                <div className="macro-modal__result-pill macro-modal__result-pill--protein">
                                    <span className="macro-modal__result-value">
                                        {results.goalProtein}g
                                    </span>
                                    <span className="macro-modal__result-label">
                                        Protein
                                    </span>
                                </div>
                                <div className="macro-modal__result-pill macro-modal__result-pill--fat">
                                    <span className="macro-modal__result-value">
                                        {results.goalFat}g
                                    </span>
                                    <span className="macro-modal__result-label">
                                        Fat
                                    </span>
                                </div>
                                <div className="macro-modal__result-pill macro-modal__result-pill--carbs">
                                    <span className="macro-modal__result-value">
                                        {results.goalCarbs}g
                                    </span>
                                    <span className="macro-modal__result-label">
                                        Carbs
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="macro-modal__footer">
                    <button
                        type="button"
                        className="macro-modal__cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="macro-modal__apply-btn"
                        onClick={handleApply}
                        disabled={!results}
                    >
                        Apply to Form
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default MacroCalculatorModal;
