import { useState } from "react";
import { toast } from "react-toastify";
import { Calculator, Save, Loader2 } from "lucide-react";
import { updateGoals } from "../../../../api/userApi";
import MacroCalculatorModal from "../MacroCalculatorModal/MacroCalculatorModal";
import "./GoalsForm.scss";

const GOAL_FIELDS = [
    {
        key: "goalCalories",
        label: "Daily Calories",
        unit: "kcal",
        placeholder: "2000",
    },
    {
        key: "goalProtein",
        label: "Protein",
        unit: "g",
        placeholder: "140",
    },
    {
        key: "goalFat",
        label: "Fat",
        unit: "g",
        placeholder: "65",
    },
    {
        key: "goalCarbs",
        label: "Carbs",
        unit: "g",
        placeholder: "210",
    },
];

const GoalsForm = ({ user, onGoalsUpdate }) => {
    const [formData, setFormData] = useState({
        goalCalories: user?.goalCalories ?? "",
        goalProtein: user?.goalProtein ?? "",
        goalFat: user?.goalFat ?? "",
        goalCarbs: user?.goalCarbs ?? "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isCalcOpen, setIsCalcOpen] = useState(false);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        // Clear field error on change
        if (errors[key]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        for (const field of GOAL_FIELDS) {
            const val = Number(formData[field.key]);
            if (!formData[field.key] && formData[field.key] !== 0) {
                newErrors[field.key] = `${field.label} is required`;
            } else if (isNaN(val) || val <= 0) {
                newErrors[field.key] =
                    `${field.label} must be a positive number`;
            }
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            goalCalories: Math.round(Number(formData.goalCalories)),
            goalProtein: Math.round(Number(formData.goalProtein)),
            goalFat: Math.round(Number(formData.goalFat)),
            goalCarbs: Math.round(Number(formData.goalCarbs)),
        };

        setLoading(true);
        try {
            const response = await updateGoals(payload);
            const updatedUser = response.data.user || response.data;
            onGoalsUpdate(updatedUser);
            toast.success("Nutritional goals updated successfully!");
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                "Failed to update goals. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyCalculated = (calculated) => {
        setFormData({
            goalCalories: calculated.goalCalories,
            goalProtein: calculated.goalProtein,
            goalFat: calculated.goalFat,
            goalCarbs: calculated.goalCarbs,
        });
        setErrors({});
    };

    return (
        <>
            <form className="goals-form" onSubmit={handleSubmit}>
                <div className="goals-form__header">
                    <h2 className="goals-form__title">
                        Daily Nutritional Goals
                    </h2>
                    <p className="goals-form__description">
                        Set your target intake for each macro nutrient
                    </p>
                </div>

                <div className="goals-form__fields">
                    {GOAL_FIELDS.map((field) => (
                        <div key={field.key} className="goals-form__field">
                            <label
                                className="goals-form__label"
                                htmlFor={field.key}
                            >
                                {field.label}
                            </label>
                            <div className="goals-form__input-wrapper">
                                <input
                                    id={field.key}
                                    type="number"
                                    min="1"
                                    step="1"
                                    className={`goals-form__input ${errors[field.key] ? "goals-form__input--error" : ""}`}
                                    value={formData[field.key]}
                                    onChange={(e) =>
                                        handleChange(field.key, e.target.value)
                                    }
                                    placeholder={field.placeholder}
                                    disabled={loading}
                                />
                                <span className="goals-form__unit">
                                    {field.unit}
                                </span>
                            </div>
                            {errors[field.key] && (
                                <span className="goals-form__error">
                                    {errors[field.key]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="goals-form__actions">
                    <button
                        type="button"
                        className="goals-form__calc-btn"
                        onClick={() => setIsCalcOpen(true)}
                        disabled={loading}
                    >
                        <Calculator size={18} strokeWidth={2} />
                        <span>Calculate Recommended Goals</span>
                    </button>

                    <button
                        type="submit"
                        className="goals-form__save-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2
                                size={18}
                                strokeWidth={2}
                                className="goals-form__spinner"
                            />
                        ) : (
                            <Save size={18} strokeWidth={2} />
                        )}
                        <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                </div>
            </form>

            <MacroCalculatorModal
                isOpen={isCalcOpen}
                onClose={() => setIsCalcOpen(false)}
                onApply={handleApplyCalculated}
            />
        </>
    );
};

export default GoalsForm;
