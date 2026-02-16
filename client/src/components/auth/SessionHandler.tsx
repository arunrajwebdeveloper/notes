import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userAPI } from "../../api/endpoints/user.api";
import { authAPI } from "../../api/endpoints/auth.api";
import {
  setAuthenticationData,
  logout as logoutAction,
  setLoading,
} from "../../store/features/authSlice";

export const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      try {
        dispatch(setLoading(true));
        const currentUser = await userAPI.getCurrentUser();
        dispatch(setAuthenticationData({ user: currentUser }));
      } catch {
        try {
          await authAPI.refresh();
          const currentUser = await userAPI.getCurrentUser();
          dispatch(setAuthenticationData({ user: currentUser }));
        } catch {
          dispatch(logoutAction());
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkSession();
  }, [dispatch]);

  // Prevent flickering
  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};
