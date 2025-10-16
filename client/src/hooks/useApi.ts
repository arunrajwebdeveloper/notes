// src/hooks/useApi.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient from "../api/axios.config";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    },
  });
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/posts", data);
      return response.data;
    },
  });
};
