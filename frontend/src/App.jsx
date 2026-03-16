import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/index.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ScaleLoader } from "react-spinners";

import Sidebar from "./components/sidebar";
import Header from "./components/header";

import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

import Projects from "./pages/Student/Projects";
import LiveTracking from "./pages/Student/LiveTracking";
import Tutorial from "./pages/Student/Tutorial";

import AllTracking from "./pages/Admin/allTracking";
import ManageProject from "./pages/Admin/manageProject";
import ManageUser from "./pages/Admin/manageUser";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  const hideNavbarRoutes = ["/login", "/register"];
  const isLandingPage = location.pathname === "/" && !user;

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col items-center space-y-2">
          <ScaleLoader height={80} width={10} radius={20} />
          <p className="pl-3 text-2xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthRoute = hideNavbarRoutes.includes(location.pathname);
  const hideChrome = isAuthRoute || isLandingPage;

  return (
    <div className="flex">
      {!hideChrome && <Sidebar />}

      <div
        className={`w-full flex-1 overflow-y-auto ${hideChrome ? "h-full" : "h-screen"}`}
      >
        <Toaster />
        <SonnerToaster
          position="top-center"
          expand={false}
          richColors
          className="z-[150]"
        />

        <div
          className={`flex flex-col ${hideChrome ? "h-full" : "h-screen"} ${hideChrome ? "" : "mt-16"}`}
        >
          {!hideChrome && <Header />}

          {/* 🔥 IMPORTANT — Routes wrapper */}
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Landing />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={!user ? <Navigate to="/login" /> : <Profile />}
            />

            {/* USER ROUTES */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute
                  element={<Projects />}
                  allowedRoles={["user"]}
                />
              }
            />

            <Route
              path="/liveTracking/:projectId"
              element={
                <ProtectedRoute
                  element={<LiveTracking />}
                  allowedRoles={["user"]}
                />
              }
            />

            <Route
              path="/liveTracking"
              element={
                <ProtectedRoute
                  element={<LiveTracking />}
                  allowedRoles={["user"]}
                />
              }
            />

            <Route
              path="/tutorial"
              element={
                <ProtectedRoute
                  element={<Tutorial />}
                  allowedRoles={["user"]}
                />
              }
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/manageProject"
              element={
                <ProtectedRoute
                  element={<ManageProject />}
                  allowedRoles={["admin"]}
                />
              }
            />

            <Route
              path="/manageUser"
              element={
                <ProtectedRoute
                  element={<ManageUser />}
                  allowedRoles={["admin"]}
                />
              }
            />

            <Route
              path="/allTracking"
              element={
                <ProtectedRoute
                  element={<AllTracking />}
                  allowedRoles={["admin"]}
                />
              }
            />

            <Route
              path="/allTracking/:projectId"
              element={
                <ProtectedRoute
                  element={<AllTracking />}
                  allowedRoles={["admin"]}
                />
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
