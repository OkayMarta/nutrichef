import "./MealForm.scss";

const MealForm = ({
    formData,
    onChange,
    onBlur,
    onSubmit,
    onReset,
    errors,
    touched,
    submitting,
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        onBlur(name);
    };

    return (
        <form className="meal-form" onSubmit={onSubmit} noValidate>
            {/* Section 1: Basic Information */}
            <div className="meal-form__section">
                <div className="meal-form__section-header">
                    <span className="meal-form__section-icon">🍳</span>
                    <div>
                        <h2 className="meal-form__section-title">
                            Dish Details
                        </h2>
                        <p className="meal-form__section-subtitle">
                            Enter the name and the total cooked weight of your
                            dish
                        </p>
                    </div>
                </div>

                <div className="meal-form__fields-stack">
                    {/* Dish Name */}
                    <div className="meal-form__group">
                        <label className="meal-form__label" htmlFor="meal-name">
                            Dish Name{" "}
                            <span className="meal-form__required">*</span>
                        </label>
                        <input
                            id="meal-name"
                            name="name"
                            type="text"
                            className={`meal-form__input ${
                                touched.name && errors.name
                                    ? "meal-form__input--error"
                                    : ""
                            }`}
                            placeholder="e.g., Baked Salmon with Herb Rice"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            required
                        />
                        {touched.name && errors.name && (
                            <span className="meal-form__error-msg">
                                {errors.name}
                            </span>
                        )}
                        <span className="meal-form__hint">
                            A clear name to easily find this dish in your recipe
                            book
                        </span>
                    </div>

                    {/* Total Cooked Weight */}
                    <div className="meal-form__group">
                        <label
                            className="meal-form__label"
                            htmlFor="meal-weight"
                        >
                            Total Cooked Weight (grams){" "}
                            <span className="meal-form__required">*</span>
                        </label>
                        <div className="meal-form__input-wrapper">
                            <input
                                id="meal-weight"
                                name="totalWeight"
                                type="number"
                                step="any"
                                min="1"
                                className={`meal-form__input ${
                                    touched.totalWeight && errors.totalWeight
                                        ? "meal-form__input--error"
                                        : ""
                                }`}
                                placeholder="e.g., 650"
                                value={formData.totalWeight}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            <span className="meal-form__unit">g</span>
                        </div>
                        {touched.totalWeight && errors.totalWeight && (
                            <span className="meal-form__error-msg">
                                {errors.totalWeight}
                            </span>
                        )}
                        <span className="meal-form__hint">
                            Weigh the entire cooked dish after preparation to
                            compute precise values per 100&nbsp;g
                        </span>
                    </div>
                </div>
            </div>

            {/* Section 2: Total Macros */}
            <div className="meal-form__section">
                <div className="meal-form__section-header">
                    <span className="meal-form__section-icon">📊</span>
                    <div>
                        <h2 className="meal-form__section-title">
                            Total Cooked Nutrition
                        </h2>
                        <p className="meal-form__section-subtitle">
                            Total calories and macronutrients for the entire
                            cooked batch
                        </p>
                    </div>
                </div>

                <div className="meal-form__grid">
                    {/* Total Calories */}
                    <div className="meal-form__group">
                        <label
                            className="meal-form__label"
                            htmlFor="meal-calories"
                        >
                            Total Calories{" "}
                            <span className="meal-form__required">*</span>
                        </label>
                        <div className="meal-form__input-wrapper">
                            <input
                                id="meal-calories"
                                name="totalCalories"
                                type="number"
                                step="any"
                                min="0"
                                className={`meal-form__input ${
                                    touched.totalCalories &&
                                    errors.totalCalories
                                        ? "meal-form__input--error"
                                        : ""
                                }`}
                                placeholder="e.g., 950"
                                value={formData.totalCalories}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            <span className="meal-form__unit">kcal</span>
                        </div>
                        {touched.totalCalories && errors.totalCalories && (
                            <span className="meal-form__error-msg">
                                {errors.totalCalories}
                            </span>
                        )}
                    </div>

                    {/* Total Protein */}
                    <div className="meal-form__group">
                        <label
                            className="meal-form__label"
                            htmlFor="meal-protein"
                        >
                            Total Protein{" "}
                            <span className="meal-form__required">*</span>
                        </label>
                        <div className="meal-form__input-wrapper">
                            <input
                                id="meal-protein"
                                name="totalProtein"
                                type="number"
                                step="any"
                                min="0"
                                className={`meal-form__input ${
                                    touched.totalProtein && errors.totalProtein
                                        ? "meal-form__input--error"
                                        : ""
                                }`}
                                placeholder="e.g., 75"
                                value={formData.totalProtein}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            <span className="meal-form__unit">g</span>
                        </div>
                        {touched.totalProtein && errors.totalProtein && (
                            <span className="meal-form__error-msg">
                                {errors.totalProtein}
                            </span>
                        )}
                    </div>

                    {/* Total Fat */}
                    <div className="meal-form__group">
                        <label className="meal-form__label" htmlFor="meal-fat">
                            Total Fat{" "}
                            <span className="meal-form__required">*</span>
                        </label>
                        <div className="meal-form__input-wrapper">
                            <input
                                id="meal-fat"
                                name="totalFat"
                                type="number"
                                step="any"
                                min="0"
                                className={`meal-form__input ${
                                    touched.totalFat && errors.totalFat
                                        ? "meal-form__input--error"
                                        : ""
                                }`}
                                placeholder="e.g., 32"
                                value={formData.totalFat}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            <span className="meal-form__unit">g</span>
                        </div>
                        {touched.totalFat && errors.totalFat && (
                            <span className="meal-form__error-msg">
                                {errors.totalFat}
                            </span>
                        )}
                    </div>

                    {/* Total Carbs */}
                    <div className="meal-form__group">
                        <label
                            className="meal-form__label"
                            htmlFor="meal-carbs"
                        >
                            Total Carbs{" "}
                            <span className="meal-form__required">*</span>
                        </label>
                        <div className="meal-form__input-wrapper">
                            <input
                                id="meal-carbs"
                                name="totalCarbs"
                                type="number"
                                step="any"
                                min="0"
                                className={`meal-form__input ${
                                    touched.totalCarbs && errors.totalCarbs
                                        ? "meal-form__input--error"
                                        : ""
                                }`}
                                placeholder="e.g., 85"
                                value={formData.totalCarbs}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            <span className="meal-form__unit">g</span>
                        </div>
                        {touched.totalCarbs && errors.totalCarbs && (
                            <span className="meal-form__error-msg">
                                {errors.totalCarbs}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 3: Action Buttons */}
            <div className="meal-form__actions">
                <button
                    type="submit"
                    className="btn btn--primary meal-form__submit-btn"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className="meal-form__spinner" />
                            <span>Saving Meal...</span>
                        </>
                    ) : (
                        <>
                            <span>💾</span>
                            <span>Save to Recipe Book</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn btn--secondary meal-form__reset-btn"
                    onClick={onReset}
                    disabled={submitting}
                >
                    Reset Fields
                </button>
            </div>
        </form>
    );
};

export default MealForm;
