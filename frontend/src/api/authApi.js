import apiClient from "./client";

const extractApiError = (error, fallbackMessage) => {
  const details = error.response?.data?.details;
  if (Array.isArray(details) && details.length) {
    return details.join(", ");
  }

  return error.response?.data?.message || fallbackMessage;
};

export const authApi = {
  register: async (payload) => {
    try {
      const response = await apiClient.post("/auth/register", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractApiError(error, "Registration failed."));
    }
  },
  login: async (payload) => {
    try {
      const response = await apiClient.post("/auth/login", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractApiError(error, "Login failed."));
    }
  },
  verifyOtp: async (payload) => {
    try {
      const response = await apiClient.post("/auth/verify-otp", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractApiError(error, "OTP verification failed."));
    }
  },
  resendOtp: async (payload) => {
    try {
      const response = await apiClient.post("/auth/resend-otp", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractApiError(error, "Unable to resend OTP."));
    }
  },
  forgotPassword: async (payload) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractApiError(error, "Unable to start password reset."));
    }
  },
  resetPassword: async (payload) => {
    try {
      const response = await apiClient.post("/auth/reset-password", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractApiError(error, "Password reset failed."));
    }
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
