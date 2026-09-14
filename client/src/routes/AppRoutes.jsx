import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import CreateMeal from "../pages/CreateMeal/CreateMeal";
import SavedMeals from "../pages/SavedMeals/SavedMeals";
import Settings from "../pages/Settings/Settings";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import TermsOfService from "../pages/Legal/TermsOfService";
import NotFound from "../pages/NotFound/NotFound";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Landing & Legal */}
            <Route path="/" element={<Landing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Guest Only Routes */}
            <Route element={<GuestRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/calculator" element={<CreateMeal />} />
                <Route path="/create-meal" element={<CreateMeal />} />
                <Route path="/meals" element={<SavedMeals />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
