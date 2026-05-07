import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  config.headers["x-device-name"] = "Web Portal";
  return config;
});

export default apiClient;

