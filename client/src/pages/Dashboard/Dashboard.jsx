import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getDashboardData } from "../../api/dashboardApi";
import { deleteDailyLog } from "../../api/dailyLogApi";
import { getLocalDateString } from "../../utils/dateUtils";
import DateNavigator from "./components/DateNavigator/DateNavigator";
import MealSection from "./components/MealSection/MealSection";
import AddLogModal from "./components/AddLogModal/AddLogModal";
import EditLogModal from "./components/EditLogModal/EditLogModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal/ConfirmDeleteModal";
import DailyNutritionSummary from "./components/DailyNutritionSummary/DailyNutritionSummary";
import DailyTip from "./components/DailyTip/DailyTip";
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
    const [editingLog, setEditingLog] = useState(null);
    const [deletingLog, setDeletingLog] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    // Open edit modal
    const handleOpenEditLog = (log) => {
        setEditingLog(log);
    };

    // Open delete confirmation modal
    const handleOpenDeleteLog = (log) => {
        setDeletingLog(log);
    };

    // Confirmed delete execution
    const handleConfirmDelete = async () => {
        if (!deletingLog) return;
        setIsDeleting(true);
        try {
            await deleteDailyLog(deletingLog.id);
            toast.success("Meal entry removed.");
            setDeletingLog(null);
            triggerRefetch();
        } catch (error) {
            console.error("Failed to delete log entry:", error);
            const message =
                error.response?.data?.message ||
                "Failed to remove meal entry. Please try again.";
            toast.error(message);
        } finally {
            setIsDeleting(false);
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
                                onEditLog={handleOpenEditLog}
                                onDeleteLog={handleOpenDeleteLog}
                            />
                        ))}
                    </div>

                    {/* Right Column: Daily Summary & Tip */}
                    <aside className="dashboard__summary-col">
                        <DailyNutritionSummary
                            activeDate={activeDate}
                            totals={totals}
                            goals={goals}
                            loading={initialLoading}
                        />
                        <DailyTip activeDate={activeDate} />
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

            {/* Edit Meal Log Modal Dialog */}
            {editingLog && (
                <EditLogModal
                    log={editingLog}
                    onClose={() => setEditingLog(null)}
                    onLogUpdated={triggerRefetch}
                />
            )}

            {/* Delete Confirmation Modal Dialog */}
            {deletingLog && (
                <ConfirmDeleteModal
                    log={deletingLog}
                    deleting={isDeleting}
                    onClose={() => setDeletingLog(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </main>
    );
};

export default Dashboard;
