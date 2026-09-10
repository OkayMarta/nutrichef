import LeafIcon from "../../../../components/common/LeafIcon";
import "./DashboardPreview.scss";

const DashboardPreview = () => {
    return (
        <div className="dashboard-preview">
            <div className="dashboard-preview__backdrop" />

            <div className="dashboard-preview__card">
                {/* Left mini sidebar */}
                <aside className="dashboard-preview__sidebar">
                    <div className="dashboard-preview__sidebar-logo">
                        <span>🍃</span>
                        <span>NutriChef</span>
                    </div>
                    <div className="dashboard-preview__sidebar-nav">
                        <div className="dashboard-preview__sidebar-item dashboard-preview__sidebar-item--active">
                            <span>🏠</span> Home
                        </div>
                        <div className="dashboard-preview__sidebar-item">
                            <span>📖</span> Saved Meals
                        </div>
                        <div className="dashboard-preview__sidebar-item">
                            <span>➕</span> Create Meal
                        </div>
                    </div>
                </aside>

                {/* Right preview content */}
                <div className="dashboard-preview__content">
                    <div className="dashboard-preview__header">
                        <h4>Today</h4>
                        <span>📅 May 25, 2024</span>
                    </div>

                    {/* Breakfast Card */}
                    <div className="dashboard-preview__meal">
                        <div className="dashboard-preview__meal-top">
                            <div className="dashboard-preview__meal-info">
                                <div className="dashboard-preview__meal-icon dashboard-preview__meal-icon--breakfast">
                                    ☀️
                                </div>
                                <div>
                                    <div className="dashboard-preview__meal-name">
                                        Breakfast
                                    </div>
                                    <div className="dashboard-preview__meal-cals">
                                        0 kcal
                                    </div>
                                </div>
                            </div>
                            <span className="dashboard-preview__add-btn">
                                + Add meal
                            </span>
                        </div>
                        <div className="dashboard-preview__empty-state">
                            <span className="icon">🍴</span>
                            <div>
                                <strong>No meal added</strong>
                                Add your meal to track calories and macros.
                            </div>
                        </div>
                    </div>

                    {/* Lunch Card */}
                    <div className="dashboard-preview__meal">
                        <div className="dashboard-preview__meal-top">
                            <div className="dashboard-preview__meal-info">
                                <div className="dashboard-preview__meal-icon dashboard-preview__meal-icon--lunch">
                                    🌿
                                </div>
                                <div>
                                    <div className="dashboard-preview__meal-name">
                                        Lunch
                                    </div>
                                    <div className="dashboard-preview__meal-cals">
                                        0 kcal
                                    </div>
                                </div>
                            </div>
                            <span className="dashboard-preview__add-btn">
                                + Add meal
                            </span>
                        </div>
                        <div className="dashboard-preview__empty-state">
                            <span className="icon">🍴</span>
                            <div>
                                <strong>No meal added</strong>
                                Add your meal to track calories and macros.
                            </div>
                        </div>
                    </div>

                    {/* Dinner Card */}
                    <div className="dashboard-preview__meal">
                        <div className="dashboard-preview__meal-top">
                            <div className="dashboard-preview__meal-info">
                                <div className="dashboard-preview__meal-icon dashboard-preview__meal-icon--dinner">
                                    🌙
                                </div>
                                <div>
                                    <div className="dashboard-preview__meal-name">
                                        Dinner
                                    </div>
                                    <div className="dashboard-preview__meal-cals">
                                        0 kcal
                                    </div>
                                </div>
                            </div>
                            <span className="dashboard-preview__add-btn">
                                + Add meal
                            </span>
                        </div>
                        <div className="dashboard-preview__empty-state">
                            <span className="icon">🍴</span>
                            <div>
                                <strong>No meal added</strong>
                                Add your meal to track calories and macros.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Leaf Graphic matching the logo */}
            <LeafIcon
                className="dashboard-preview__decor-leaf"
                width={48}
                height={48}
                color="#469c3c"
            />
        </div>
    );
};

export default DashboardPreview;
