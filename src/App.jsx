import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// custem import
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { PrivateRoute } from "./components/PrivateRoute";
import TournamentsListPage from "./pages/dashboard/TournamentsListPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* // private pages  */}
          <Route path="/profile" element={<RegisterPage />} />

          {/* ---------------------------  */}
          {/* Protected routes */}
          <Route
            path="/tournaments"
            element={
              <PrivateRoute>
                <TournamentsListPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
