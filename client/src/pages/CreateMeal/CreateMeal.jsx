import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createMeal } from "../../api/mealApi";
import { calculateMacroPer100g } from "../../utils/nutrition";
import MealForm from "./components/MealForm/MealForm";
import MealSummaryCard from "./components/MealSummaryCard/MealSummaryCard";
import "./CreateMeal.scss";

const initialFormState = {
    name: "",
    totalWeight: "",
    totalCalories: "",
    totalProtein: "",
    totalFat: "",
    totalCarbs: "",
};

const CreateMeal = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [savedMeal, setSavedMeal] = useState(null);

    // Weight validity check
    const weightNum = parseFloat(formData.totalWeight);
    const hasValidWeight = !isNaN(weightNum) && weightNum > 0;

    // Macro calculation per 100g with safe default 0 (never NaN)
    const caloriesPer100g = useMemo(
        () =>
            calculateMacroPer100g(formData.totalCalories, formData.totalWeight),
        [formData.totalCalories, formData.totalWeight],
    );

    const proteinPer100g = useMemo(
        () =>
            calculateMacroPer100g(formData.totalProtein, formData.totalWeight),
        [formData.totalProtein, formData.totalWeight],
    );

    const fatPer100g = useMemo(
        () => calculateMacroPer100g(formData.totalFat, formData.totalWeight),
        [formData.totalFat, formData.totalWeight],
    );

    const carbsPer100g = useMemo(
        () => calculateMacroPer100g(formData.totalCarbs, formData.totalWeight),
        [formData.totalCarbs, formData.totalWeight],
    );

    // Validation function
    const validate = (data) => {
        const errs = {};

        if (!data.name || !data.name.trim()) {
            errs.name = "Dish name is required";
        }

        const weight = parseFloat(data.totalWeight);
        if (
            data.totalWeight === "" ||
            data.totalWeight === null ||
            data.totalWeight === undefined ||
            isNaN(weight) ||
            weight <= 0
        ) {
            errs.totalWeight = "Cooked weight must be greater than 0 g";
        }

        // For macros, an empty field defaults to 0 (valid). Negative values trigger an error.
        const cals = data.totalCalories === "" ? 0 : Number(data.totalCalories);
        if (isNaN(cals) || cals < 0) {
            errs.totalCalories = "Total calories must be 0 or greater";
        }

        const protein =
            data.totalProtein === "" ? 0 : Number(data.totalProtein);
        if (isNaN(protein) || protein < 0) {
            errs.totalProtein = "Total protein must be 0 or greater";
        }

        const fat = data.totalFat === "" ? 0 : Number(data.totalFat);
        if (isNaN(fat) || fat < 0) {
            errs.totalFat = "Total fat must be 0 or greater";
        }

        const carbs = data.totalCarbs === "" ? 0 : Number(data.totalCarbs);
        if (isNaN(carbs) || carbs < 0) {
            errs.totalCarbs = "Total carbs must be 0 or greater";
        }

        return errs;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Live error clearing if field was touched
        if (touched[field]) {
            const nextErrors = validate({ ...formData, [field]: value });
            setErrors((prev) => ({
                ...prev,
                [field]: nextErrors[field] || undefined,
            }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const currentErrors = validate(formData);
        setErrors(currentErrors);
    };

    const handleReset = () => {
        setFormData(initialFormState);
        setErrors({});
        setTouched({});
        setSavedMeal(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        const allTouched = {
            name: true,
            totalWeight: true,
            totalCalories: true,
            totalProtein: true,
            totalFat: true,
            totalCarbs: true,
        };
        setTouched(allTouched);

        const currentErrors = validate(formData);
        setErrors(currentErrors);

        if (Object.keys(currentErrors).length > 0) {
            toast.error(
                "Please fill in all required fields with valid values.",
            );
            return;
        }

        try {
            setSubmitting(true);
            // Explicit numeric casting ensures numbers (never strings) are sent
            const payload = {
                name: String(formData.name).trim(),
                caloriesPer100g: parseFloat(caloriesPer100g) || 0,
                proteinPer100g: parseFloat(proteinPer100g) || 0,
                fatPer100g: parseFloat(fatPer100g) || 0,
                carbsPer100g: parseFloat(carbsPer100g) || 0,
            };

            const response = await createMeal(payload);
            setSavedMeal(response.data);
            await createMeal(payload);
            toast.success(
                "Meal successfully created and saved to your recipes!",
            );
            handleReset();
        } catch (error) {
            console.error("Failed to create meal:", error);
            const message =
                error.response?.data?.message ||
                "Failed to create meal. Please check your inputs and try again.";
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-meal">
            <div className="create-meal__container container">
                {/* Success Banner (when a meal was just saved) */}
                {savedMeal && (
                    <div className="create-meal__success-banner">
                        <div className="create-meal__success-info">
                            <span className="create-meal__success-icon">
                                🎉
                            </span>
                            <div>
                                <h3 className="create-meal__success-title">
                                    Meal &quot;{savedMeal.name}&quot;
                                    successfully saved!
                                </h3>
                                <p className="create-meal__success-desc">
                                    Base profile calculated:{" "}
                                    {savedMeal.caloriesPer100g} kcal,{" "}
                                    {savedMeal.proteinPer100g} g protein,{" "}
                                    {savedMeal.fatPer100g} g fat,{" "}
                                    {savedMeal.carbsPer100g} g carbs per 100 g.
                                </p>
                            </div>
                        </div>
                        <div className="create-meal__success-actions">
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={() => navigate("/meals")}
                            >
                                View in Saved Meals &rarr;
                            </button>
                            <button
                                type="button"
                                className="btn btn--secondary"
                                onClick={handleReset}
                            >
                                + Create Another Meal
                            </button>
                        </div>
                    </div>
                )}

                {/* 2-Column Responsive Layout */}
                <div className="create-meal__layout">
                    {/* Left Column: Input Form */}
                    <div className="create-meal__form-col">
                        <MealForm
                            formData={formData}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                            errors={errors}
                            touched={touched}
                            submitting={submitting}
                        />
                    </div>

                    {/* Right Column: Sticky Live Preview Card */}
                    <aside className="create-meal__preview-col">
                        <div className="create-meal__preview-sticky">
                            <MealSummaryCard
                                name={formData.name}
                                totalWeight={formData.totalWeight}
                                caloriesPer100g={caloriesPer100g}
                                proteinPer100g={proteinPer100g}
                                fatPer100g={fatPer100g}
                                carbsPer100g={carbsPer100g}
                                hasValidWeight={hasValidWeight}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CreateMeal;
