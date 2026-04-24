import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("sep_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["x-device-name"] = "Web Portal";
  return config;
});

export default apiClient;

