// src/api/endpoints/auth.api.ts
import apiClient from "../axios.config";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/user/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  },
};
