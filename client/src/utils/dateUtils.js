/**
 * Date manipulation utilities in local timezone.
 * Uses YYYY-MM-DD strings to avoid UTC offset shifts.
 */

/**
 * Returns a date formatted as YYYY-MM-DD in the user's local timezone.
 *
 * @param {Date} [date=new Date()]
 * @returns {string} e.g. "2026-09-12"
 */
export const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

/**
 * Parses a YYYY-MM-DD string into a local Date object.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {Date}
 */
export const parseLocalDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") {
        return new Date();
    }
    const parts = dateStr.split("-").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
        return new Date();
    }
    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
};

/**
 * Shifts a YYYY-MM-DD date by a given number of days (+1, -1, etc.).
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {number} days - number of days to shift
 * @returns {string} new "YYYY-MM-DD"
 */
export const shiftDate = (dateStr, days) => {
    const date = parseLocalDate(dateStr);
    date.setDate(date.getDate() + days);
    return getLocalDateString(date);
};

/**
 * Checks if a YYYY-MM-DD string matches today's local date.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {boolean}
 */
export const isToday = (dateStr) => {
    return dateStr === getLocalDateString(new Date());
};

/**
 * Formats a YYYY-MM-DD string into human-friendly text:
 * - "Today, MMM D" (e.g., "Today, Sep 12")
 * - "Yesterday, MMM D" (e.g., "Yesterday, Sep 11")
 * - "Tomorrow, MMM D" (e.g., "Tomorrow, Sep 13")
 * - "MMM D, YYYY" (e.g., "Sep 9, 2026")
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {string}
 */
export const formatHumanDate = (dateStr) => {
    const target = parseLocalDate(dateStr);
    const todayStr = getLocalDateString(new Date());
    const yesterdayStr = shiftDate(todayStr, -1);
    const tomorrowStr = shiftDate(todayStr, 1);

    const monthDay = target.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    if (dateStr === todayStr) {
        return `Today, ${monthDay}`;
    }
    if (dateStr === yesterdayStr) {
        return `Yesterday, ${monthDay}`;
    }
    if (dateStr === tomorrowStr) {
        return `Tomorrow, ${monthDay}`;
    }

    return target.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};
