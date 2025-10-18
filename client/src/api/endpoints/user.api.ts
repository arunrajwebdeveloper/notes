import type { ApiResponse } from "../../types/api.types";
import type { User } from "../../types/user.types";
import apiClient from "../axios.config";

export const userAPI = {
  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/user/me");
    return response.data.result;
  },
};
