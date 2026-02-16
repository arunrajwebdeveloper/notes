import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { userAPI } from "../../api/endpoints/user.api";
import {
  setAuthenticationData,
  logout as logoutAction,
  setLoading,
} from "../../store/features/authSlice";
import CircleSpinner from "../common/CircleSpinner";

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

  if (loading)
    return (
      <div className="text-center h-screen w-full bg-white text-blue-600 flex justify-center items-center">
        <CircleSpinner size={36} />
      </div>
    );

  return <>{children}</>;
};
