import apiClient from "./client";

export const userApi = {
  profile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data.data;
  },
  notifications: async () => {
    const response = await apiClient.get("/users/notifications");
    return response.data.data;
  },
  sessions: async () => {
    const response = await apiClient.get("/users/sessions");
    return response.data.data;
  },
};

