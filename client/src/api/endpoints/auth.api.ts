import type { ApiResponse } from "../../types/api.types";
import type {
  LoginCredentials,
  RegisterData,
  User,
} from "../../types/auth.types";
import apiClient from "../axios.config";

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data.result;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data.result;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data.result;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/user/me");
    return response.data.result;
  },

  refreshToken: async () => {
    const response = await apiClient.post("/auth/refresh");
    return response.data.result;
  },
};
