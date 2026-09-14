/**
 * Derives a display name from the user object.
 * Priority: user.name (Latin-only) → email local-part capitalised → "User"
 */
export const getUserDisplayName = (user) => {
    if (!user) return "User";

    if (user.name && typeof user.name === "string") {
        const trimmed = user.name.trim();
        if (trimmed.length > 0 && /^[a-zA-Z\s]+$/.test(trimmed)) {
            return trimmed;
        }
    }

    if (user.email && typeof user.email === "string") {
        const localPart = user.email.split("@")[0];
        if (localPart) {
            return localPart.charAt(0).toUpperCase() + localPart.slice(1);
        }
    }

    return "User";
};

/**
 * Returns the first character of the user's display name, uppercased.
 */
export const getUserInitials = (user) => {
    return getUserDisplayName(user).charAt(0).toUpperCase();
};
