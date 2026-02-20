import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoute";
import OfflineModal from "./components/modal/OfflineModal";
import CircleSpinner from "./components/common/CircleSpinner";
import { SessionHandler } from "./components/auth/SessionHandler";
import { useCookieSupport } from "./hooks/useCookieSupport";
import CookieDisabledModal from "./components/modal/CookieDisabledModal";
import NoteFound from "./view/NoteFound";
import { useAppDispatch } from "./hooks/hooks";
import useWindowWidth from "./hooks/useWindowWidth";
import { setWindowWidth } from "./store/features/windowSlice";

// Lazy load pages
const NotesPage = lazy(() => import("./view/NotesPage"));
const LoginPage = lazy(() => import("./view/LoginPage"));
const RegisterPage = lazy(() => import("./view/RegisterPage"));
const ProfilePage = lazy(() => import("./view/ProfilePage"));
const UnauthorizedPage = lazy(() => import("./view/UnauthorizedPage"));
// const AdminPage = lazy(() => import("./view/AdminPage"));

function App() {
  const dispatch = useAppDispatch();
  const cookiesEnabled = useCookieSupport();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    dispatch(setWindowWidth(windowWidth));
  }, [windowWidth, dispatch]);

  return (
    <SessionHandler>
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
            <Route path="*" element={<NoteFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <OfflineModal />
      {!cookiesEnabled && <CookieDisabledModal />}
    </SessionHandler>
  );
}

export default App;
