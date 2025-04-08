import HomePage from "./pages/HomePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/tournaments"
            element={
              <PrivateRoute>{/* <TournamentsListPage /> */}</PrivateRoute>
            }
          />
          {/* Other protected routes */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
