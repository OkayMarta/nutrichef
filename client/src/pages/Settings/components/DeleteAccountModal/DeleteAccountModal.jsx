import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import "./DeleteAccountModal.scss";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {
    // Keyboard ESC listener and body scroll lock
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !isDeleting) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose, isDeleting]);

    if (!isOpen) return null;

    return (
        <div
            className="delete-account-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isDeleting) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
        >
            <div className="delete-account-modal">
                <div className="delete-account-modal__icon-wrap">
                    <AlertTriangle
                        size={28}
                        className="delete-account-modal__icon"
                    />
                </div>

                <h2
                    id="delete-account-title"
                    className="delete-account-modal__title"
                >
                    Delete Account?
                </h2>

                <p className="delete-account-modal__desc">
                    Are you sure you want to permanently delete your NutriChef
                    account? This will immediately erase:
                </p>

                <ul className="delete-account-modal__list">
                    <li>All your created recipes and saved meals</li>
                    <li>
                        Your daily food diary entries and historical records
                    </li>
                    <li>Your customized nutritional calorie and macro goals</li>
                    <li>Your profile pictures and personal details</li>
                </ul>

                <p className="delete-account-modal__warning">
                    <strong>This action is irreversible.</strong> Once deleted,
                    your account data cannot be recovered.
                </p>

                <div className="delete-account-modal__actions">
                    <button
                        type="button"
                        className="delete-account-modal__btn delete-account-modal__btn--cancel"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="delete-account-modal__btn delete-account-modal__btn--delete"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="delete-account-modal__spinner"
                                />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            "Yes, delete my account"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
