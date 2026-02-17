import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { store } from "../store/store";
import { logout } from "../store/features/authSlice";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3050/api";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // send cookies
});

apiClient.interceptors.request.use((config) => {
  if (!navigator.cookieEnabled) {
    alert("Cookies are disabled. Please enable them to stay logged in.");
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // If the request that failed was the refresh request,
    // don't try to refresh again. Just logout.
    if (originalRequest.url.includes("/auth/refresh")) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    // Check if the error is 401 (Unauthorized)
    // and that we haven't already tried to refresh this specific request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request so we don't loop infinitely

      try {
        // Attempt to refresh the session
        // This call will work because 'withCredentials' sends the refresh_token cookie
        await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        // If refresh succeeds, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails (Refresh Token expired), log the user out
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (404, 500, etc.), just throw the error
    return Promise.reject(error);
  },
);

export default apiClient;
