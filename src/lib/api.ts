import axios from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token dari NextAuth
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // NextAuth akan handle refresh token secara otomatis
      // Redirect ke login jika session expired
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Show error toast
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Terjadi kesalahan";
    if (typeof window !== "undefined") {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

// Helper function untuk API calls tanpa interceptor (untuk auth endpoints)
export const createAuthApiClient = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default apiClient;
