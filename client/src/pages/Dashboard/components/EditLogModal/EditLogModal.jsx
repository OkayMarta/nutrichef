import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateDailyLog } from "../../../../api/dailyLogApi";
import "./EditLogModal.scss";

const QUICK_PORTIONS = [50, 100, 150, 200, 250, 300, 400];

const EditLogModal = ({ log, onClose, onLogUpdated }) => {
    const [consumedGrams, setConsumedGrams] = useState(
        log?.consumedGrams ? Math.round(log.consumedGrams) : 150,
    );
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Escape key & body scroll lock
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    if (!log) return null;

    const meal = log.meal || {};
    const mealName = meal.name || "Meal";

    // Base densities per 100g
    const calPer100g = meal.caloriesPer100g || 0;
    const proteinPer100g = meal.proteinPer100g || 0;
    const fatPer100g = meal.fatPer100g || 0;
    const carbsPer100g = meal.carbsPer100g || 0;

    // Live calculated macros
    const numericGrams = parseFloat(consumedGrams) || 0;
    const factor = Math.max(0, numericGrams) / 100;
    const liveCalories = Math.round(calPer100g * factor);
    const liveProtein = (proteinPer100g * factor).toFixed(1);
    const liveFat = (fatPer100g * factor).toFixed(1);
    const liveCarbs = (carbsPer100g * factor).toFixed(1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (numericGrams <= 0) {
            setError("Portion weight must be greater than 0 grams.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            await updateDailyLog(log.id, {
                consumedGrams: numericGrams,
            });
            toast.success("Portion weight updated.");
            if (onLogUpdated) {
                onLogUpdated();
            }
            onClose();
        } catch (err) {
            console.error("Failed to update daily log:", err);
            const msg =
                err.response?.data?.message ||
                "Failed to update portion. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="edit-log-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-log-title"
        >
            <div className="edit-log-modal">
                <div className="edit-log-modal__header">
                    <h2 id="edit-log-title" className="edit-log-modal__title">
                        Edit Portion Weight
                    </h2>
                    <button
                        type="button"
                        className="edit-log-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <div className="edit-log-modal__dish-info">
                    <span className="edit-log-modal__dish-name">
                        {mealName}
                    </span>
                    <span className="edit-log-modal__dish-density">
                        Base: {Math.round(calPer100g)} kcal / 100g
                    </span>
                </div>

                <form className="edit-log-modal__form" onSubmit={handleSubmit}>
                    {/* Portion Weight Input */}
                    <div className="edit-log-modal__group">
                        <label
                            className="edit-log-modal__label"
                            htmlFor="edit-log-grams"
                        >
                            Weight (grams)
                        </label>
                        <div className="edit-log-modal__input-wrap">
                            <input
                                id="edit-log-grams"
                                type="number"
                                min="1"
                                max="5000"
                                step="1"
                                className={`edit-log-modal__input ${
                                    error ? "edit-log-modal__input--error" : ""
                                }`}
                                value={consumedGrams}
                                onChange={(e) => {
                                    setConsumedGrams(e.target.value);
                                    if (error) setError("");
                                }}
                                autoFocus
                            />
                            <span className="edit-log-modal__unit">g</span>
                        </div>
                        {error && (
                            <span className="edit-log-modal__error-msg">
                                {error}
                            </span>
                        )}
                    </div>

                    {/* Quick Portion Selector Chips */}
                    <div className="edit-log-modal__quick-chips">
                        {QUICK_PORTIONS.map((grams) => (
                            <button
                                key={grams}
                                type="button"
                                className={`edit-log-modal__chip ${
                                    numericGrams === grams
                                        ? "edit-log-modal__chip--active"
                                        : ""
                                }`}
                                onClick={() => {
                                    setConsumedGrams(grams);
                                    if (error) setError("");
                                }}
                            >
                                {grams}g
                            </button>
                        ))}
                    </div>

                    {/* Live Calculated Nutrients Card */}
                    <div className="edit-log-modal__preview">
                        <span className="edit-log-modal__preview-title">
                            Recalculated Nutrients
                        </span>
                        <div className="edit-log-modal__preview-grid">
                            <div className="edit-log-modal__preview-item edit-log-modal__preview-item--calories">
                                <span className="preview-val">
                                    {liveCalories}
                                </span>
                                <span className="preview-lbl">Calories</span>
                            </div>
                            <div className="edit-log-modal__preview-item">
                                <span className="preview-val">
                                    {liveProtein}g
                                </span>
                                <span className="preview-lbl">Protein</span>
                            </div>
                            <div className="edit-log-modal__preview-item">
                                <span className="preview-val">{liveFat}g</span>
                                <span className="preview-lbl">Fat</span>
                            </div>
                            <div className="edit-log-modal__preview-item">
                                <span className="preview-val">
                                    {liveCarbs}g
                                </span>
                                <span className="preview-lbl">Carbs</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="edit-log-modal__actions">
                        <button
                            type="button"
                            className="edit-log-modal__btn edit-log-modal__btn--cancel"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="edit-log-modal__btn edit-log-modal__btn--submit"
                            disabled={submitting || numericGrams <= 0}
                        >
                            {submitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLogModal;
