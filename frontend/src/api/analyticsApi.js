import apiClient from "./client";

export const analyticsApi = {
  myOverview: async () => {
    const response = await apiClient.get("/analytics/my-overview");
    return response.data.data;
  },
  companyOverview: async () => {
    const response = await apiClient.get("/analytics/company-overview");
    return response.data.data;
  },
  employeePerformance: async () => {
    const response = await apiClient.get("/analytics/employee-performance");
    return response.data.data;
  },
  departmentOverview: async () => {
    const response = await apiClient.get("/analytics/department-overview");
    return response.data.data;
  },
  securityOverview: async () => {
    const response = await apiClient.get("/analytics/security-overview");
    return response.data.data;
  },
};

