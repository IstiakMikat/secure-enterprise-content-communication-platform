import apiClient from "./client";

export const postApi = {
  list: async () => {
    const response = await apiClient.get("/posts/list");
    return response.data.data;
  },
  drafts: async () => {
    const response = await apiClient.get("/posts/drafts/list");
    return response.data.data;
  },
  create: async (payload) => {
    const response = await apiClient.post("/posts/create", payload);
    return response.data.data;
  },
};

