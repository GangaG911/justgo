import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import Recommendations from "./pages/Recommendations";
import SavedLooks from "./pages/SavedLooks";
import Profile from "./pages/Profile";

import "./App.css";

function AppLayout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public pages */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected pages */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/wardrobe"
              element={<Wardrobe />}
            />

            <Route
              path="/recommendations"
              element={<Recommendations />}
            />

            <Route
              path="/saved"
              element={<SavedLooks />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

          </Route>

        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;