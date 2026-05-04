import apiClient from "./client";

export const adminApi = {
  users: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data.data;
  },
  keys: async () => {
    const response = await apiClient.get("/admin/keys");
    return response.data.data;
  },
  auditLogs: async () => {
    const response = await apiClient.get("/admin/logs/audit");
    return response.data.data;
  },
  integrityAlerts: async () => {
    const response = await apiClient.get("/admin/logs/integrity-alerts");
    return response.data.data;
  },
  securitySummary: async () => {
    const response = await apiClient.get("/admin/logs/security-summary");
    return response.data.data;
  },
  biometricLogs: async () => {
    const response = await apiClient.get("/biometric/logs");
    return response.data.data;
  },
};

