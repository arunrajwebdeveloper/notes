// src/hooks/useAuth.ts (Updated with direct API call)
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/endpoints/auth.api";
import {
  setAccessToken,
  logout as logoutAction,
  setLoading,
  setUserData,
} from "../store/features/authSlice";
import type { RootState } from "../store/store";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Login mutation - SOLUTION 1: Direct API call
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: async (data) => {
      if (data?.access_token) {
        try {
          dispatch(setLoading(true));
          dispatch(
            setAccessToken({
              token: data.access_token,
            })
          );
          const currentUser = await authAPI.getCurrentUser();
          dispatch(
            setUserData({
              user: currentUser,
            })
          );
          navigate("/notes");
        } catch (error) {
          console.error("Failed to fetch user:", error);
          dispatch(logoutAction());
        } finally {
          dispatch(setLoading(false));
        }
      }
    },
    onError: (error: any) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: async () => {
      navigate("/login");
    },
    onError: (error: any) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    },
  });

  // Get current user query (optional - for refreshing user data)
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authAPI.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
  });

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading: loading || isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};
