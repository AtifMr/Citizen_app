import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config/api";

const api = axios.create({
  baseURL: typeof API_URL === "string" ? API_URL : "",
  headers: { "Content-Type": "application/json" },
});

// Attach token if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
