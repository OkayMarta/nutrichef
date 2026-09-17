import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Route-level Code Splitting for optimal First Contentful Paint & Bundle Chunks
const Landing = lazy(() => import("../pages/Landing/Landing"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const CreateMeal = lazy(() => import("../pages/CreateMeal/CreateMeal"));
const SavedMeals = lazy(() => import("../pages/SavedMeals/SavedMeals"));
const Settings = lazy(() => import("../pages/Settings/Settings"));
const PrivacyPolicy = lazy(() => import("../pages/Legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/Legal/TermsOfService"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const RouteFallback = () => (
    <div
        style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
        }}
    >
        <svg
            width="36"
            height="36"
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#469c3c"
            aria-label="Loading..."
        >
            <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" strokeWidth="3">
                    <circle strokeOpacity=".2" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.8s"
                            repeatCount="indefinite"
                        />
                    </path>
                </g>
            </g>
        </svg>
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                {/* Public Legal */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />

                {/* Guest Only Routes (Landing & Auth) */}
                <Route element={<GuestRoute />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
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
        </Suspense>
    );
};

export default AppRoutes;
