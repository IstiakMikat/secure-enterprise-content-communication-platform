import apiClient from "./client";

export const approvalApi = {
  getPending: async () => {
    const response = await apiClient.get("/approvals/pending");
    return response.data.data;
  },
  approve: async (postId) => {
    const response = await apiClient.post(`/approvals/${postId}/approve`);
    return response.data.data;
  },
  reject: async (postId) => {
    const response = await apiClient.post(`/approvals/${postId}/reject`);
    return response.data.data;
  },
};
