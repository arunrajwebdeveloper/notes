import type { LoginCredentials, RegisterData } from "../../types/auth.types";
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

  refresh: async () => {
    const response = await apiClient.post("/auth/refresh");
    return response.data.result;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },
};
