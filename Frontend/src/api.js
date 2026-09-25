import axios from "axios";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackBaseURL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://loomly-backend-aw3h.onrender.com";
const resolvedBaseURL = (configuredBaseURL || fallbackBaseURL).replace(/\/+$/, "");
const apiUrl = resolvedBaseURL.endsWith("/api/v1")
  ? resolvedBaseURL
  : `${resolvedBaseURL}/api/v1`;

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Axios Response Interceptor for Token Refresh
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error) => {
    const originalRequest = error.config || {};
    const statusCode = error.response?.status;
    const requestUrl = originalRequest.url || "";
    const isRefreshRequest = requestUrl.includes("/users/refresh-token");
    const isCurrentUserRequest = requestUrl.includes("/users/current-user");

    // Check if the error is 401, it's not a retry, AND the failed request was NOT for the refresh-token endpoint itself.
    if (statusCode === 401 && !isRefreshRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        // Attempt to refresh the access token
        await api.post("/users/refresh-token");
        
        // If successful, the new cookie is set automatically. Retry the original request.
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh attempt itself fails, the session is truly invalid.
        if (!isCurrentUserRequest) {
          console.error("Session expired. Please log in again.");
        }
        // Optional: you could programmatically log the user out here
        // logout(); 
        return Promise.reject(refreshError);
      }
    }

    // For all other errors (or if the refresh token call fails), just reject the promise
    return Promise.reject(error);
  }
);

export default api;