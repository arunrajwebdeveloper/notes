import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/endpoints/auth.api";
import {
  logout as logoutAction,
  setAuthenticationData,
  setLoading,
} from "../store/features/authSlice";
import { useAppDispatch } from "./hooks";
import { useAppSelector } from "../hooks";
import { userAPI } from "../api/endpoints/user.api";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth,
  );

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: async () => {
      try {
        dispatch(setLoading(true));
        const currentUser = await userAPI.getCurrentUser();
        dispatch(
          setAuthenticationData({
            user: currentUser,
          }),
        );
        navigate("/notes", { replace: true });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        dispatch(logoutAction());
        navigate("/login", { replace: true });
      } finally {
        dispatch(setLoading(false));
      }
    },
    onError: (error: any) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message,
      );
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: async () => {
      navigate("/login", { replace: true });
    },
    onError: (error: any) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message,
      );
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    },
    onError: (error: any) => {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message,
      );
    },
  });

  // Get current user query (optional - for refreshing user data)
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: userAPI.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    user,
    isAuthenticated,
    loading: loading || isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
