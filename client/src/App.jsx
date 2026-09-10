import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div
                    className="app-layout"
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Navbar />
                    <main className="app-main" style={{ flex: 1 }}>
                        <AppRoutes />
                    </main>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
