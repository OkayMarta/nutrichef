import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { updateMeal } from "../../../../api/mealApi";
import { calculateCalorieDistribution } from "../../../../utils/nutrition";
import "./EditMealModal.scss";

const EditMealModal = ({ meal, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: meal.name || "",
        caloriesPer100g: meal.caloriesPer100g ?? "",
        proteinPer100g: meal.proteinPer100g ?? "",
        fatPer100g: meal.fatPer100g ?? "",
        carbsPer100g: meal.carbsPer100g ?? "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        // Lock body scroll
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    // Live calorie distribution preview
    const macroStats = useMemo(
        () =>
            calculateCalorieDistribution(
                formData.proteinPer100g,
                formData.fatPer100g,
                formData.carbsPer100g,
            ),
        [formData.proteinPer100g, formData.fatPer100g, formData.carbsPer100g],
    );

    const validate = () => {
        const errs = {};
        if (!formData.name || !formData.name.trim()) {
            errs.name = "Dish name is required";
        }

        const cals = Number(formData.caloriesPer100g);
        if (formData.caloriesPer100g !== "" && (isNaN(cals) || cals < 0)) {
            errs.caloriesPer100g = "Calories must be 0 or greater";
        }

        const protein = Number(formData.proteinPer100g);
        if (formData.proteinPer100g !== "" && (isNaN(protein) || protein < 0)) {
            errs.proteinPer100g = "Protein must be 0 or greater";
        }

        const fat = Number(formData.fatPer100g);
        if (formData.fatPer100g !== "" && (isNaN(fat) || fat < 0)) {
            errs.fatPer100g = "Fat must be 0 or greater";
        }

        const carbs = Number(formData.carbsPer100g);
        if (formData.carbsPer100g !== "" && (isNaN(carbs) || carbs < 0)) {
            errs.carbsPer100g = "Carbs must be 0 or greater";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please provide valid information for all fields.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                name: formData.name.trim(),
                caloriesPer100g: parseFloat(formData.caloriesPer100g) || 0,
                proteinPer100g: parseFloat(formData.proteinPer100g) || 0,
                fatPer100g: parseFloat(formData.fatPer100g) || 0,
                carbsPer100g: parseFloat(formData.carbsPer100g) || 0,
            };

            const response = await updateMeal(meal.id, payload);
            toast.success("Meal updated successfully!");
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error("Failed to update meal:", error);
            const message =
                error.response?.data?.message ||
                "Failed to update meal. Please try again.";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="edit-modal-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
        >
            <div className="edit-modal">
                {/* Modal Header */}
                <div className="edit-modal__header">
                    <div className="edit-modal__title-group">
                        <span className="edit-modal__badge">
                            <Pencil
                                size={13}
                                className="edit-modal__badge-icon"
                            />
                            <span>Edit Dish</span>
                        </span>
                        <h2 id="edit-modal-title" className="edit-modal__title">
                            {meal.name}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="edit-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close edit dialog"
                    >
                        &times;
                    </button>
                </div>

                {/* Edit Form */}
                <form
                    className="edit-modal__form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Dish Name */}
                    <div className="edit-modal__group">
                        <label
                            className="edit-modal__label"
                            htmlFor="edit-meal-name"
                        >
                            Dish Name{" "}
                            <span className="edit-modal__required">*</span>
                        </label>
                        <input
                            id="edit-meal-name"
                            type="text"
                            className={`edit-modal__input ${
                                errors.name ? "edit-modal__input--error" : ""
                            }`}
                            value={formData.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            required
                        />
                        {errors.name && (
                            <span className="edit-modal__error-msg">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <p className="edit-modal__notice">
                        Values per <strong>100&nbsp;g</strong> serving
                    </p>

                    {/* Macros Grid */}
                    <div className="edit-modal__macros-grid">
                        {/* Calories */}
                        <div className="edit-modal__group">
                            <label
                                className="edit-modal__label"
                                htmlFor="edit-calories"
                            >
                                Calories (kcal)
                            </label>
                            <input
                                id="edit-calories"
                                type="number"
                                step="any"
                                min="0"
                                className={`edit-modal__input ${
                                    errors.caloriesPer100g
                                        ? "edit-modal__input--error"
                                        : ""
                                }`}
                                value={formData.caloriesPer100g}
                                onChange={(e) =>
                                    handleChange(
                                        "caloriesPer100g",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.caloriesPer100g && (
                                <span className="edit-modal__error-msg">
                                    {errors.caloriesPer100g}
                                </span>
                            )}
                        </div>

                        {/* Protein */}
                        <div className="edit-modal__group">
                            <label
                                className="edit-modal__label"
                                htmlFor="edit-protein"
                            >
                                Protein (g)
                            </label>
                            <input
                                id="edit-protein"
                                type="number"
                                step="any"
                                min="0"
                                className={`edit-modal__input ${
                                    errors.proteinPer100g
                                        ? "edit-modal__input--error"
                                        : ""
                                }`}
                                value={formData.proteinPer100g}
                                onChange={(e) =>
                                    handleChange(
                                        "proteinPer100g",
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.proteinPer100g && (
                                <span className="edit-modal__error-msg">
                                    {errors.proteinPer100g}
                                </span>
                            )}
                        </div>

                        {/* Fat */}
                        <div className="edit-modal__group">
                            <label
                                className="edit-modal__label"
                                htmlFor="edit-fat"
                            >
                                Fat (g)
                            </label>
                            <input
                                id="edit-fat"
                                type="number"
                                step="any"
                                min="0"
                                className={`edit-modal__input ${
                                    errors.fatPer100g
                                        ? "edit-modal__input--error"
                                        : ""
                                }`}
                                value={formData.fatPer100g}
                                onChange={(e) =>
                                    handleChange("fatPer100g", e.target.value)
                                }
                            />
                            {errors.fatPer100g && (
                                <span className="edit-modal__error-msg">
                                    {errors.fatPer100g}
                                </span>
                            )}
                        </div>

                        {/* Carbs */}
                        <div className="edit-modal__group">
                            <label
                                className="edit-modal__label"
                                htmlFor="edit-carbs"
                            >
                                Carbs (g)
                            </label>
                            <input
                                id="edit-carbs"
                                type="number"
                                step="any"
                                min="0"
                                className={`edit-modal__input ${
                                    errors.carbsPer100g
                                        ? "edit-modal__input--error"
                                        : ""
                                }`}
                                value={formData.carbsPer100g}
                                onChange={(e) =>
                                    handleChange("carbsPer100g", e.target.value)
                                }
                            />
                            {errors.carbsPer100g && (
                                <span className="edit-modal__error-msg">
                                    {errors.carbsPer100g}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Mini Ratio Preview */}
                    {macroStats.hasData && (
                        <div className="edit-modal__ratio-preview">
                            <div className="edit-modal__ratio-header">
                                <span>Ratio:</span>
                                <span>
                                    Protein {macroStats.pPct}% &bull; Fat{" "}
                                    {macroStats.fPct}% &bull; Carbs{" "}
                                    {macroStats.cPct}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="edit-modal__actions">
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
                            className="btn btn--primary edit-modal__submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="edit-modal__spinner" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMealModal;
