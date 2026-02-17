import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userAPI } from "../../api/endpoints/user.api";
import {
  setAuthenticationData,
  logout as logoutAction,
  setLoading,
} from "../../store/features/authSlice";

export const SessionHandler = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if cookies are disabled at the browser level
    if (!navigator.cookieEnabled) {
      alert(
        "This app requires cookies to keep you logged in. Please enable them in your browser settings.",
      );
      dispatch(setLoading(false));
      return;
    }

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
