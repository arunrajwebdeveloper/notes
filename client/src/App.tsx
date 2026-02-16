import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoute";
import OfflineModal from "./components/modal/OfflineModal";
import CircleSpinner from "./components/common/CircleSpinner";
import SidebarContextProvider from "./context/SidebarContext";
import StoreProvider from "./providers/StoreProvider";
import { SessionHandler } from "./components/auth/SessionHandler";

// Lazy load pages
const NotesPage = lazy(() => import("./view/NotesPage"));
const LoginPage = lazy(() => import("./view/LoginPage"));
const RegisterPage = lazy(() => import("./view/RegisterPage"));
const ProfilePage = lazy(() => import("./view/ProfilePage"));
const UnauthorizedPage = lazy(() => import("./view/UnauthorizedPage"));
// const AdminPage = lazy(() => import("./view/AdminPage"));

function App() {
  return (
    <StoreProvider>
      <SessionHandler>
        <SidebarContextProvider>
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="text-center h-screen w-full bg-white text-blue-600 flex justify-center items-center">
                  <CircleSpinner size={36} />
                </div>
              }
            >
              <Routes>
                {/* Public routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  }
                />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Admin only route */}
                {/* <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route> */}

                {/* Error routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/" element={<Navigate to="/notes" replace />} />
                <Route path="*" element={<Navigate to="/notes" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SidebarContextProvider>
        <OfflineModal />
      </SessionHandler>
    </StoreProvider>
  );
}

export default App;
