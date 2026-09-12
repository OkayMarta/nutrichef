/**
 * Calculates nutritional values per 100g.
 * Formula: round((Number(totalMacro) || 0) * 100 / totalWeight, 2)
 *
 * Handles zero values and empty fields safely:
 * - If totalMacro is empty, null, undefined, or 0 -> returns 0 (never NaN).
 * - If totalWeight is empty, <= 0, or invalid -> returns 0 (never NaN).
 *
 * @param {number|string} totalMacro - Total amount of calories, protein, fat, or carbs
 * @param {number|string} totalWeight - Total cooked weight in grams
 * @returns {number} Nutritional value per 100g rounded to 2 decimal places
 */
export const calculateMacroPer100g = (totalMacro, totalWeight) => {
    const weight = parseFloat(totalWeight);
    if (!weight || isNaN(weight) || weight <= 0) {
        return 0;
    }
    const macroVal = Number(totalMacro) || 0;
    if (macroVal <= 0) {
        return 0;
    }
    return Number(((macroVal * 100) / weight).toFixed(2));
};

/**
 * Calculates the percentage distribution of calories from macronutrients.
 * Protein: 4 kcal/g
 * Fat: 9 kcal/g
 * Carbs: 4 kcal/g
 *
 * @param {number|string} proteinPer100g
 * @param {number|string} fatPer100g
 * @param {number|string} carbsPer100g
 * @returns {{ pPct: number, fPct: number, cPct: number, hasData: boolean }}
 */
export const calculateCalorieDistribution = (
    proteinPer100g,
    fatPer100g,
    carbsPer100g,
) => {
    const pCals = (Number(proteinPer100g) || 0) * 4;
    const fCals = (Number(fatPer100g) || 0) * 9;
    const cCals = (Number(carbsPer100g) || 0) * 4;
    const total = pCals + fCals + cCals;

    if (total <= 0) {
        return { pPct: 0, fPct: 0, cPct: 0, hasData: false };
    }

    const pPct = Math.round((pCals / total) * 100);
    const fPct = Math.round((fCals / total) * 100);
    const cPct = Math.max(0, 100 - pPct - fPct);

    return { pPct, fPct, cPct, hasData: true };
};
