import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import "./ConfirmDeleteModal.scss";

const ConfirmDeleteModal = ({ log, onClose, onConfirm, deleting = false }) => {
    // Escape key & body scroll lock
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !deleting) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose, deleting]);

    if (!log) return null;

    const dishName = log.meal?.name || "this dish";
    const grams = log.consumedGrams || 0;

    return (
        <div
            className="confirm-delete-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget && !deleting) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
        >
            <div className="confirm-delete-modal">
                <div className="confirm-delete-modal__icon-wrap">
                    <Trash2 size={24} className="confirm-delete-modal__icon" />
                </div>

                <h2
                    id="confirm-delete-title"
                    className="confirm-delete-modal__title"
                >
                    Remove Meal Entry
                </h2>

                <p className="confirm-delete-modal__desc">
                    Are you sure you want to remove <strong>{dishName}</strong>{" "}
                    ({grams}g) from your log? This action cannot be undone.
                </p>

                <div className="confirm-delete-modal__actions">
                    <button
                        type="button"
                        className="confirm-delete-modal__btn confirm-delete-modal__btn--cancel"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="confirm-delete-modal__btn confirm-delete-modal__btn--delete"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting ? "Removing..." : "Remove Entry"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
