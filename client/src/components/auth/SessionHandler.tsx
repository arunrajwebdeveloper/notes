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
    // if (!navigator.cookieEnabled) {
    //   alert(
    //     "This app requires cookies to keep you logged in. Please enable them in your browser settings.",
    //   );
    //   dispatch(setLoading(false));
    //   return;
    // }

    const checkCookiesReallyWork = () => {
      try {
        // 1. Try to set a test cookie
        document.cookie = "testcookie=1; SameSite=Lax";
        const isCookieSet = document.cookie.indexOf("testcookie=") !== -1;

        // 2. Immediately clean it up
        document.cookie =
          "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

        return isCookieSet;
      } catch (e) {
        return false;
      }
    };

    if (!checkCookiesReallyWork()) {
      alert(
        "Cookies are blocked! Please enable 'Cross-Site Tracking' or 'Third-Party Cookies' in your browser settings to log in.",
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
