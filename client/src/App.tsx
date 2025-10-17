import { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoute";
import OfflineModal from "./components/modal/OfflineModal";

// Lazy load pages
const NotesPage = lazy(() => import("./view/NotesPage"));
const LoginPage = lazy(() => import("./view/LoginPage"));
const RegisterPage = lazy(() => import("./view/RegisterPage"));
const ProfilePage = lazy(() => import("./view/ProfilePage"));
const UnauthorizedPage = lazy(() => import("./view/UnauthorizedPage"));
// const AdminPage = lazy(() => import("./view/AdminPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense
            fallback={<div className="text-center mt-10">Loading...</div>}
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
        <OfflineModal />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
