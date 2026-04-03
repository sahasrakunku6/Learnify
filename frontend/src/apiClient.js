import axios from "axios";
import { API_BASE } from "./config";
import { auth } from "./firebase";

const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;