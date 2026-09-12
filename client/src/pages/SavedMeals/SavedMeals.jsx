import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getMeals } from "../../api/mealApi";
import MealSearchBar from "./components/MealSearchBar/MealSearchBar";
import MealCard from "./components/MealCard/MealCard";
import EditMealModal from "./components/EditMealModal/EditMealModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal/DeleteConfirmModal";
import "./SavedMeals.scss";

const SavedMeals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingMeal, setEditingMeal] = useState(null);
    const [deletingMeal, setDeletingMeal] = useState(null);

    // Fetch meals from backend (supports optional search query)
    const fetchMeals = useCallback(async (query = "") => {
        try {
            setLoading(true);
            const response = await getMeals(query);
            setMeals(response.data || []);
        } catch (error) {
            console.error("Failed to fetch meals:", error);
            toast.error("Failed to load saved meals. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load without synchronous setState in effect
    useEffect(() => {
        let ignore = false;
        getMeals()
            .then((response) => {
                if (!ignore) {
                    setMeals(response.data || []);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch meals:", error);
                if (!ignore) {
                    toast.error(
                        "Failed to load saved meals. Please refresh the page.",
                    );
                }
            })
            .finally(() => {
                if (!ignore) {
                    setLoading(false);
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    // Handle search query change (debounced in MealSearchBar)
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        fetchMeals(query);
    };

    // Update local state when a meal is edited
    const handleMealUpdated = (updatedMeal) => {
        setMeals((prev) =>
            prev.map((meal) =>
                meal.id === updatedMeal.id ? updatedMeal : meal,
            ),
        );
    };

    // Remove from local state when a meal is deleted
    const handleMealDeleted = (deletedId) => {
        setMeals((prev) => prev.filter((meal) => meal.id !== deletedId));
    };

    const hasSearch = Boolean(searchQuery.trim());

    return (
        <main className="saved-meals">
            <div className="saved-meals__container container">
                {/* Page Header */}
                <header className="saved-meals__header">
                    <span className="saved-meals__badge">
                        Database & Recipes
                    </span>
                    <h1 className="saved-meals__title">Saved Meals</h1>
                    <p className="saved-meals__subtitle">
                        Browse, update, and manage your personal collection of
                        home-cooked dishes with nutritional profiles per
                        100&nbsp;g.
                    </p>
                </header>

                {/* Search & Actions Bar */}
                <MealSearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    totalCount={meals.length}
                    loading={loading && hasSearch}
                />

                {/* Content Section */}
                {loading ? (
                    // Loading State: Skeleton Cards
                    <div className="saved-meals__grid" aria-busy="true">
                        {[1, 2, 3, 4, 5, 6].map((key) => (
                            <div key={key} className="meal-card-skeleton">
                                <div className="meal-card-skeleton__header">
                                    <div className="meal-card-skeleton__title skeleton" />
                                    <div className="meal-card-skeleton__actions skeleton" />
                                </div>
                                <div className="meal-card-skeleton__badge skeleton" />
                                <div className="meal-card-skeleton__macros">
                                    <div className="meal-card-skeleton__macro skeleton" />
                                    <div className="meal-card-skeleton__macro skeleton" />
                                    <div className="meal-card-skeleton__macro skeleton" />
                                    <div className="meal-card-skeleton__macro skeleton" />
                                </div>
                                <div className="meal-card-skeleton__bar skeleton" />
                            </div>
                        ))}
                    </div>
                ) : meals.length > 0 ? (
                    // Populated Meals Grid
                    <div className="saved-meals__grid">
                        {meals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                meal={meal}
                                onEdit={setEditingMeal}
                                onDelete={setDeletingMeal}
                            />
                        ))}
                    </div>
                ) : hasSearch ? (
                    // No Search Results State
                    <div className="saved-meals__empty-card card">
                        <div className="saved-meals__empty-icon-wrap">
                            <span className="saved-meals__empty-icon">🔍</span>
                        </div>
                        <h3 className="saved-meals__empty-title">
                            No dishes found matching &quot;{searchQuery}&quot;
                        </h3>
                        <p className="saved-meals__empty-desc">
                            We couldn&apos;t find any saved meals with that
                            name. Try checking for typos or searching for
                            different keywords.
                        </p>
                        <button
                            type="button"
                            className="btn btn--secondary"
                            onClick={() => handleSearchChange("")}
                        >
                            Clear Search Filter
                        </button>
                    </div>
                ) : (
                    // Empty Catalog State (First-time user)
                    <div className="saved-meals__empty-card card">
                        <div className="saved-meals__empty-icon-wrap">
                            <span className="saved-meals__empty-icon">🍲</span>
                        </div>
                        <h3 className="saved-meals__empty-title">
                            Your meal catalog is empty
                        </h3>
                        <p className="saved-meals__empty-desc">
                            You haven&apos;t saved any dishes yet. Use our Meal
                            Calculator to calculate nutrition per 100&nbsp;g for
                            your home-cooked meals and save them here for easy
                            daily tracking!
                        </p>
                        <Link to="/calculator" className="btn btn--primary">
                            + Create Your First Meal
                        </Link>
                    </div>
                )}
            </div>

            {/* Edit Modal Dialog */}
            {editingMeal && (
                <EditMealModal
                    meal={editingMeal}
                    onClose={() => setEditingMeal(null)}
                    onUpdate={handleMealUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingMeal && (
                <DeleteConfirmModal
                    meal={deletingMeal}
                    onClose={() => setDeletingMeal(null)}
                    onDeleted={handleMealDeleted}
                />
            )}
        </main>
    );
};

export default SavedMeals;
