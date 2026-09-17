/**
 * Derives a display name from the user object.
 * Priority: user.name (trimmed, any unicode characters) → email local-part capitalised → "User"
 */
export const getUserDisplayName = (user) => {
    if (!user) return "User";

    if (user.name && typeof user.name === "string") {
        const trimmed = user.name.trim();
        if (trimmed.length > 0) {
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
    const name = getUserDisplayName(user);
    return name.charAt(0).toUpperCase();
};

/**
 * Resolves the full URL for the user's avatar image.
 * Supports absolute URLs (e.g. Google auth picture) and relative paths (/uploads/...).
 */
export const getUserAvatarUrl = (user) => {
    if (!user || !user.avatarUrl) return null;

    if (
        user.avatarUrl.startsWith("http://") ||
        user.avatarUrl.startsWith("https://")
    ) {
        return user.avatarUrl;
    }

    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const normalizedPath = user.avatarUrl.startsWith("/")
        ? user.avatarUrl
        : `/${user.avatarUrl}`;
    return `${baseURL}${normalizedPath}`;
};
