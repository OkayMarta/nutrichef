import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { Camera, Pencil, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { updateProfile, uploadAvatar } from "../../../../api/userApi";
import {
    getUserDisplayName,
    getUserInitials,
    getUserAvatarUrl,
} from "../../../../utils/user";
import "./ProfileInfoCard.scss";

const ProfileInfoCard = ({ user, onProfileUpdate }) => {
    const { updateUser: authUpdateUser } = useAuth();
    const handleUpdate = onProfileUpdate || authUpdateUser;

    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(user?.name || "");
    const [isSavingName, setIsSavingName] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const fileInputRef = useRef(null);

    const displayName = getUserDisplayName(user);
    const initials = getUserInitials(user);
    const avatarUrl = getUserAvatarUrl(user);

    const formatMemberSince = () => {
        if (!user?.createdAt) return null;
        try {
            const date = new Date(user.createdAt);
            return date.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            });
        } catch {
            return null;
        }
    };

    const memberSince = formatMemberSince();

    // Start editing name
    const handleStartEditName = () => {
        setNameInput(user?.name || "");
        setIsEditingName(true);
    };

    // Cancel editing name
    const handleCancelEditName = () => {
        setNameInput(user?.name || "");
        setIsEditingName(false);
    };

    // Save name
    const handleSaveName = async (e) => {
        if (e) e.preventDefault();
        const trimmed = nameInput.trim();

        if (trimmed.length > 100) {
            toast.error("Name must be 100 characters or fewer.");
            return;
        }

        setIsSavingName(true);
        try {
            const res = await updateProfile({ name: trimmed });
            const updatedUser = res.data.user || res.data;
            if (handleUpdate) handleUpdate(updatedUser);
            setIsEditingName(false);
            toast.success("Name updated successfully!");
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                "Failed to update name. Please try again.";
            toast.error(msg);
        } finally {
            setIsSavingName(false);
        }
    };

    // Trigger file chooser
    const handleAvatarClick = () => {
        if (isUploadingAvatar) return;
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    // Handle avatar file selection
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: size up to 2MB
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image file must be under 2MB.");
            return;
        }

        // Validation: allowed types
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPEG, PNG, WebP, and GIF images are supported.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        setIsUploadingAvatar(true);
        try {
            const res = await uploadAvatar(formData);
            const updatedUser = res.data.user || res.data;
            if (handleUpdate) handleUpdate(updatedUser);
            toast.success("Avatar updated successfully!");
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                "Failed to upload avatar. Please try again.";
            toast.error(msg);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    return (
        <div className="profile-info-card">
            {/* Avatar Section */}
            <div className="profile-info-card__avatar-container">
                <div
                    className={`profile-info-card__avatar ${isUploadingAvatar ? "profile-info-card__avatar--loading" : ""}`}
                    onClick={handleAvatarClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleAvatarClick();
                        }
                    }}
                    title="Click to upload new avatar"
                >
                    {isUploadingAvatar ? (
                        <Loader2
                            size={28}
                            className="profile-info-card__spinner"
                        />
                    ) : avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="profile-info-card__avatar-img"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback =
                                    e.currentTarget.parentElement?.querySelector(
                                        ".profile-info-card__avatar-fallback",
                                    );
                                if (fallback) fallback.style.display = "flex";
                            }}
                        />
                    ) : (
                        initials
                    )}
                    <span
                        className="profile-info-card__avatar-fallback"
                        style={{ display: "none" }}
                    >
                        {initials}
                    </span>
                </div>

                <button
                    type="button"
                    className="profile-info-card__avatar-btn"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    aria-label="Upload profile picture"
                    title="Upload profile picture"
                >
                    <Camera size={14} strokeWidth={2.2} />
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    style={{ display: "none" }}
                />
            </div>

            {/* Profile Details Section */}
            <div className="profile-info-card__details">
                {isEditingName ? (
                    <form
                        className="profile-info-card__name-form"
                        onSubmit={handleSaveName}
                    >
                        <input
                            type="text"
                            className="profile-info-card__name-input"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Your name"
                            autoFocus
                            disabled={isSavingName}
                            maxLength={100}
                        />
                        <div className="profile-info-card__name-actions">
                            <button
                                type="submit"
                                className="profile-info-card__action-btn profile-info-card__action-btn--confirm"
                                disabled={isSavingName}
                                title="Save name"
                                aria-label="Save name"
                            >
                                {isSavingName ? (
                                    <Loader2
                                        size={14}
                                        className="profile-info-card__spinner"
                                    />
                                ) : (
                                    <Check size={14} strokeWidth={2.5} />
                                )}
                            </button>
                            <button
                                type="button"
                                className="profile-info-card__action-btn profile-info-card__action-btn--cancel"
                                onClick={handleCancelEditName}
                                disabled={isSavingName}
                                title="Cancel"
                                aria-label="Cancel editing"
                            >
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-info-card__name-row">
                        <h2 className="profile-info-card__name">
                            {displayName}
                        </h2>
                        <button
                            type="button"
                            className="profile-info-card__edit-btn"
                            onClick={handleStartEditName}
                            title="Edit name"
                            aria-label="Edit name"
                        >
                            <Pencil size={13} strokeWidth={2.2} />
                        </button>
                    </div>
                )}

                <p className="profile-info-card__email">{user?.email}</p>

                {memberSince && (
                    <p className="profile-info-card__member-since">
                        Member since {memberSince}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileInfoCard;
