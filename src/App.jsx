import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// custem import
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { PrivateRoute } from "./components/PrivateRoute";
import TournamentsListPage from "./pages/dashboard/TournamentsListPage";
import Navbar from "./components/smart/NavBar";
import Footer from "./components/static/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />


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
        
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>


    </>
  );
}

export default App;
