import { Trash2, AlertCircle } from "lucide-react";
import "./DangerZoneCard.scss";

const DangerZoneCard = ({ onDeleteClick }) => {
    return (
        <div className="danger-zone-card">
            <div className="danger-zone-card__header">
                <div className="danger-zone-card__badge">
                    <AlertCircle size={15} />
                    <span>Danger Zone</span>
                </div>
                <h3 className="danger-zone-card__title">Delete Account</h3>
            </div>

            <p className="danger-zone-card__desc">
                Permanently delete your NutriChef account, saved meals, daily
                food diary logs, goals, and uploaded avatar. Once your account
                is deleted, there is no going back. Please be certain.
            </p>

            <div className="danger-zone-card__action">
                <button
                    type="button"
                    className="danger-zone-card__btn"
                    onClick={onDeleteClick}
                    aria-label="Delete your account"
                >
                    <Trash2 size={16} />
                    <span>Delete Account</span>
                </button>
            </div>
        </div>
    );
};

export default DangerZoneCard;
