import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    // ✅ Only attach token if NOT hitting login/register
    if (
  token &&
  !config.url.includes("auth/login") &&
  !config.url.includes("auth/register") &&
  !config.url.includes("password-reset") &&
  !config.url.includes("password-reset-confirm")
) {
  config.headers.Authorization = `Bearer ${token}`;
}

    return config;
  },
  (error) => Promise.reject(error)
);

// Repayments by user (admin only)
export const getRepaymentsByUser = () => api.get("admin/repayments-by-user/");

export default api;
