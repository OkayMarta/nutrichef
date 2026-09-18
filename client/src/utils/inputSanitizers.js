/**
 * Input sanitization and protection utilities for numeric and dish data fields.
 */

/**
 * Prevents typing negative signs, plus signs, or scientific notation ('-', '+', 'e', 'E')
 * on keyboard keydown events for numeric input elements.
 *
 * @param {KeyboardEvent} e
 */
export const blockInvalidNumberKeys = (e) => {
    if (["-", "+", "e", "E"].includes(e.key)) {
        e.preventDefault();
    }
};

/**
 * Sanitizes numeric string input (e.g. from typing, pasting, or dragging):
 * - Strips any negative sign, letters, or special characters.
 * - Allows only digits and at most one decimal point.
 * - Optionally constrains maximum decimal places.
 * - Optionally caps to a maximum value threshold.
 *
 * @param {string|number} val
 * @param {number} [max=Infinity]
 * @param {number} [maxDecimals=2]
 * @returns {string} Sanitized string
 */
export const sanitizeNonNegativeNumber = (
    val,
    max = Infinity,
    maxDecimals = 2,
) => {
    if (val === "" || val === null || val === undefined) return "";
    let str = String(val).replace(/[^0-9.]/g, "");

    // Allow only one decimal point
    const parts = str.split(".");
    if (parts.length > 2) {
        str = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit decimal precision if dot is present
    if (parts.length === 2 && parts[1].length > maxDecimals) {
        str = parts[0] + "." + parts[1].slice(0, maxDecimals);
    }

    // Cap at maximum if exceeded
    if (max !== Infinity && str !== "" && Number(str) > max) {
        return String(max);
    }

    return str;
};

/**
 * Sanitizes integer input (e.g. portion weight in whole grams):
 * - Strips all non-digit characters.
 * - Strips leading zeros.
 * - Optionally caps to a maximum value threshold.
 *
 * @param {string|number} val
 * @param {number} [max=Infinity]
 * @returns {string} Sanitized string
 */
export const sanitizePositiveInteger = (val, max = Infinity) => {
    if (val === "" || val === null || val === undefined) return "";
    let str = String(val).replace(/[^0-9]/g, "");

    if (str.length > 1 && str.startsWith("0")) {
        str = str.replace(/^0+/, "");
        if (str === "") str = "0";
    }

    if (max !== Infinity && str !== "" && Number(str) > max) {
        return String(max);
    }

    return str;
};
