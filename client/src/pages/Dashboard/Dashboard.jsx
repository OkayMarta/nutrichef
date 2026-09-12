import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getDashboardData } from "../../api/dashboardApi";
import { deleteDailyLog } from "../../api/dailyLogApi";
import { getLocalDateString } from "../../utils/dateUtils";
import DateNavigator from "./components/DateNavigator/DateNavigator";
import MealSection from "./components/MealSection/MealSection";
import AddLogModal from "./components/AddLogModal/AddLogModal";
import "./Dashboard.scss";

const MEAL_TYPES = [
    { key: "BREAKFAST", label: "Breakfast" },
    { key: "LUNCH", label: "Lunch" },
    { key: "DINNER", label: "Dinner" },
    { key: "SNACK", label: "Snacks" },
];

const DEFAULT_TOTALS = { calories: 0, protein: 0, fat: 0, carbs: 0 };
const DEFAULT_GOALS = { calories: 2000, protein: 120, fat: 65, carbs: 250 };

const Dashboard = () => {
    const [activeDate, setActiveDate] = useState(() => getLocalDateString());
    const [refreshIndex, setRefreshIndex] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const [totals, setTotals] = useState(DEFAULT_TOTALS);
    const [goals, setGoals] = useState(DEFAULT_GOALS);
    const [logs, setLogs] = useState([]);
    const [addLogMealType, setAddLogMealType] = useState(null);

    const triggerRefetch = useCallback(() => {
        setRefreshIndex((prev) => prev + 1);
    }, []);

    useEffect(() => {
        let isCurrent = true;

        const fetchData = async () => {
            try {
                const response = await getDashboardData(activeDate);
                if (isCurrent) {
                    const data = response.data;
                    setTotals(data.totals || DEFAULT_TOTALS);
                    setGoals({
                        calories:
                            data.goals?.calories || DEFAULT_GOALS.calories,
                        protein: data.goals?.protein || DEFAULT_GOALS.protein,
                        fat: data.goals?.fat || DEFAULT_GOALS.fat,
                        carbs: data.goals?.carbs || DEFAULT_GOALS.carbs,
                    });
                    setLogs(data.logs || []);
                }
            } catch (error) {
                if (isCurrent) {
                    console.error("Failed to load dashboard data:", error);
                    toast.error("Could not load meal data for this date.");
                    setTotals(DEFAULT_TOTALS);
                    setLogs([]);
                }
            } finally {
                if (isCurrent) {
                    setInitialLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isCurrent = false;
        };
    }, [activeDate, refreshIndex]);

    // Handle deleting a meal entry
    const handleDeleteLog = async (logId) => {
        try {
            await deleteDailyLog(logId);
            toast.success("Meal entry removed.");
            triggerRefetch();
        } catch (error) {
            console.error("Failed to delete log entry:", error);
            const message =
                error.response?.data?.message ||
                "Failed to remove meal entry. Please try again.";
            toast.error(message);
        }
    };

    // Group logs by mealType
    const logsByMealType = MEAL_TYPES.reduce((acc, { key }) => {
        acc[key] = logs.filter((l) => l.mealType === key);
        return acc;
    }, {});

    // Compute calories per meal category
    const caloriesByMealType = MEAL_TYPES.reduce((acc, { key }) => {
        const catLogs = logsByMealType[key] || [];
        acc[key] = catLogs.reduce(
            (sum, l) => sum + (l.snapshotCalories || 0),
            0,
        );
        return acc;
    }, {});

    // Progress percentage helper
    const getProgressPct = (current, target) => {
        if (!target || target <= 0) return 0;
        return Math.min(100, Math.round((current / target) * 100));
    };

    return (
        <main className="dashboard">
            <div className="dashboard__container container">
                {/* Global Date Row directly above main content grid */}
                <div className="dashboard__date-header">
                    <DateNavigator
                        activeDate={activeDate}
                        onDateChange={setActiveDate}
                    />
                </div>

                {/* Main 2-Column Responsive Dashboard Layout */}
                <div className="dashboard__layout">
                    {/* Left Column: 4 Meal Categories */}
                    <div className="dashboard__logs-col">
                        {MEAL_TYPES.map(({ key, label }) => (
                            <MealSection
                                key={key}
                                mealType={key}
                                title={label}
                                logs={logsByMealType[key] || []}
                                totalCalories={caloriesByMealType[key] || 0}
                                loading={initialLoading}
                                onAddMeal={(type) => setAddLogMealType(type)}
                                onDeleteLog={handleDeleteLog}
                            />
                        ))}
                    </div>

                    {/* Right Column: Daily Summary & Tip */}
                    <aside className="dashboard__summary-col">
                        {/* Summary Card */}
                        <div className="dashboard-card daily-summary-card">
                            <div className="daily-summary-card__header">
                                <h2 className="daily-summary-card__title">
                                    Daily Nutrition Summary
                                </h2>
                                <span className="daily-summary-card__date-pill">
                                    {activeDate}
                                </span>
                            </div>

                            {initialLoading ? (
                                <div className="daily-summary-card__skeleton-stack">
                                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                                    <div className="dashboard-skeleton dashboard-skeleton--bar-block" />
                                </div>
                            ) : (
                                <div className="daily-summary-card__metrics">
                                    {/* Calories */}
                                    <div className="daily-summary-card__metric daily-summary-card__metric--calories">
                                        <div className="daily-summary-card__metric-header">
                                            <span className="metric-label">
                                                🔥 Calories
                                            </span>
                                            <span className="metric-value">
                                                <strong>
                                                    {Math.round(
                                                        totals.calories,
                                                    )}
                                                </strong>{" "}
                                                / {goals.calories} kcal
                                            </span>
                                        </div>
                                        <div className="daily-summary-card__progress-track">
                                            <div
                                                className="daily-summary-card__progress-bar daily-summary-card__progress-bar--calories"
                                                style={{
                                                    width: `${getProgressPct(
                                                        totals.calories,
                                                        goals.calories,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Protein */}
                                    <div className="daily-summary-card__metric daily-summary-card__metric--protein">
                                        <div className="daily-summary-card__metric-header">
                                            <span className="metric-label">
                                                🥩 Protein
                                            </span>
                                            <span className="metric-value">
                                                <strong>
                                                    {Number(
                                                        totals.protein,
                                                    ).toFixed(1)}
                                                </strong>{" "}
                                                / {goals.protein} g
                                            </span>
                                        </div>
                                        <div className="daily-summary-card__progress-track">
                                            <div
                                                className="daily-summary-card__progress-bar daily-summary-card__progress-bar--protein"
                                                style={{
                                                    width: `${getProgressPct(
                                                        totals.protein,
                                                        goals.protein,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Fat */}
                                    <div className="daily-summary-card__metric daily-summary-card__metric--fat">
                                        <div className="daily-summary-card__metric-header">
                                            <span className="metric-label">
                                                🥑 Fat
                                            </span>
                                            <span className="metric-value">
                                                <strong>
                                                    {Number(totals.fat).toFixed(
                                                        1,
                                                    )}
                                                </strong>{" "}
                                                / {goals.fat} g
                                            </span>
                                        </div>
                                        <div className="daily-summary-card__progress-track">
                                            <div
                                                className="daily-summary-card__progress-bar daily-summary-card__progress-bar--fat"
                                                style={{
                                                    width: `${getProgressPct(
                                                        totals.fat,
                                                        goals.fat,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Carbs */}
                                    <div className="daily-summary-card__metric daily-summary-card__metric--carbs">
                                        <div className="daily-summary-card__metric-header">
                                            <span className="metric-label">
                                                🌾 Carbs
                                            </span>
                                            <span className="metric-value">
                                                <strong>
                                                    {Number(
                                                        totals.carbs,
                                                    ).toFixed(1)}
                                                </strong>{" "}
                                                / {goals.carbs} g
                                            </span>
                                        </div>
                                        <div className="daily-summary-card__progress-track">
                                            <div
                                                className="daily-summary-card__progress-bar daily-summary-card__progress-bar--carbs"
                                                style={{
                                                    width: `${getProgressPct(
                                                        totals.carbs,
                                                        goals.carbs,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tip Card */}
                        <div className="dashboard-card tip-card">
                            <span className="tip-card__icon">💡</span>
                            <div>
                                <h3 className="tip-card__title">Daily Tip</h3>
                                <p className="tip-card__bold">
                                    Hydration & Balance
                                </p>
                                <p className="tip-card__desc">
                                    Stay well-hydrated throughout the day.
                                    Tracking cooked portion weight allows
                                    NutriChef to accurately scale calories and
                                    macros to your exact needs.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Add Meal Log Modal Dialog */}
            {addLogMealType && (
                <AddLogModal
                    initialMealType={addLogMealType}
                    activeDate={activeDate}
                    onClose={() => setAddLogMealType(null)}
                    onLogCreated={triggerRefetch}
                />
            )}
        </main>
    );
};

export default Dashboard;
