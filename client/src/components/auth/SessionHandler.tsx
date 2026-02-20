import { useEffect } from "react";
import { userAPI } from "../../api/endpoints/user.api";
import {
  setAuthenticationData,
  logout as logoutAction,
  setLoading,
} from "../../store/features/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

export const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      try {
        dispatch(setLoading(true));
        const currentUser = await userAPI.getCurrentUser();
        dispatch(setAuthenticationData({ user: currentUser }));
      } catch (error) {
        dispatch(logoutAction());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkSession();
  }, [dispatch]);

  if (loading) return null;

  return <>{children}</>;
};
