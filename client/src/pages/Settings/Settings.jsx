import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { deleteAccount } from "../../api/userApi";
import ProfileInfoCard from "./components/ProfileInfoCard/ProfileInfoCard";
import GoalsForm from "./components/GoalsForm/GoalsForm";
import DeleteAccountModal from "./components/DeleteAccountModal/DeleteAccountModal";
import "./Settings.scss";

const Settings = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const handleConfirmDelete = async () => {
        setIsDeletingAccount(true);
        try {
            const res = await deleteAccount();
            const successMsg =
                res.data?.message ||
                "Your account and all associated data have been permanently deleted.";

            logout();
            setIsDeleteModalOpen(false);
            toast.success(successMsg);
            navigate("/");
        } catch (error) {
            console.error("Account deletion failed:", error);
            const errorMsg =
                error.response?.data?.message ||
                "Failed to delete account. Please try again later.";
            toast.error(errorMsg);
        } finally {
            setIsDeletingAccount(false);
        }
    };

    return (
        <div className="settings">
            <div className="settings__container">
                <div className="settings__header">
                    <h1 className="settings__title">Settings</h1>
                    <p className="settings__subtitle">
                        Manage your profile and nutritional goals
                    </p>
                </div>

                <div className="settings__layout">
                    <aside className="settings__sidebar">
                        <ProfileInfoCard
                            user={user}
                            onProfileUpdate={updateUser}
                        />
                        <button
                            type="button"
                            className="settings__delete-account-btn"
                            onClick={() => setIsDeleteModalOpen(true)}
                            aria-label="Delete account"
                        >
                            <Trash2 size={15} />
                            <span>Delete account</span>
                        </button>
                    </aside>

                    <section className="settings__main">
                        <GoalsForm user={user} onGoalsUpdate={updateUser} />
                    </section>
                </div>
            </div>

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeletingAccount}
            />
        </div>
    );
};

export default Settings;
