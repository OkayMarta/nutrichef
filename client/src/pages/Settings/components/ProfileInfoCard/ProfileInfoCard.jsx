import { getUserDisplayName, getUserInitials } from "../../../../utils/user";
import "./ProfileInfoCard.scss";

const ProfileInfoCard = ({ user }) => {
    const displayName = getUserDisplayName(user);
    const initials = getUserInitials(user);

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

    return (
        <div className="profile-info-card">
            <div className="profile-info-card__avatar">{initials}</div>

            <div className="profile-info-card__details">
                <h2 className="profile-info-card__name">{displayName}</h2>
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
