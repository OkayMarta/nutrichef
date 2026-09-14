import { useAuth } from "../../context/AuthContext";
import ProfileInfoCard from "./components/ProfileInfoCard/ProfileInfoCard";
import GoalsForm from "./components/GoalsForm/GoalsForm";
import "./Settings.scss";

const Settings = () => {
    const { user, updateUser } = useAuth();

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
                        <ProfileInfoCard user={user} />
                    </aside>

                    <section className="settings__main">
                        <GoalsForm user={user} onGoalsUpdate={updateUser} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
