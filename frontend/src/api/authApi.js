import apiClient from "./client";

export const authApi = {
  register: async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data.data;
  },
  login: async (payload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data.data;
  },
  verifyOtp: async (payload) => {
    const response = await apiClient.post("/auth/verify-otp", payload);
    return response.data.data;
  },
  resendOtp: async (payload) => {
    const response = await apiClient.post("/auth/resend-otp", payload);
    return response.data.data;
  },
  forgotPassword: async (payload) => {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return response.data.data;
  },
  resetPassword: async (payload) => {
    const response = await apiClient.post("/auth/reset-password", payload);
    return response.data.data;
  },
  me: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data.data;
  },
};
