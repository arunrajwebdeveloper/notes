import axios, { type AxiosInstance } from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3050/api";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // send cookies
});

export default apiClient;
