import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getToken, removeToken } from "../utils/storage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3050/api";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        removeToken();
        window.location.href = "/login";
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Access forbidden");
      }

      // Handle 500 Server Error
      if (error.response.status === 500) {
        console.error("Server error occurred");
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
