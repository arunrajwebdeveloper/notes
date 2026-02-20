import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  // requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
}: // requiredRole,
ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  // if (requiredRole && user?.role !== requiredRole) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children ? <>{children}</> : <Outlet />;
};

// Public Route (redirects to dashboard if already logged in)
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  return <>{children}</>;
};
