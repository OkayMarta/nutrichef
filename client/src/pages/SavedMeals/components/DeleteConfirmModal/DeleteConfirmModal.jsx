import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteMeal } from "../../../../api/mealApi";
import "./DeleteConfirmModal.scss";

const DeleteConfirmModal = ({ meal, onClose, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteMeal(meal.id);
            toast.success(`"${meal.name}" removed from your collection.`);
            onDeleted(meal.id);
            onClose();
        } catch (error) {
            console.error("Failed to delete meal:", error);
            const message =
                error.response?.data?.message ||
                "Failed to delete meal. Please try again.";
            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div
            className="delete-modal-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div className="delete-modal">
                <div className="delete-modal__icon-wrap">
                    <Trash2 size={26} className="delete-modal__icon" />
                </div>

                <h2 id="delete-modal-title" className="delete-modal__title">
                    Delete &quot;{meal.name}&quot;?
                </h2>

                <p className="delete-modal__desc">
                    Are you sure you want to remove this dish from your saved
                    collection? This action cannot be undone.
                </p>

                <div className="delete-modal__actions">
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn delete-modal__delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <span className="delete-modal__spinner" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            "Delete Dish"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
