import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Replace with your computer's LAN IP
const API_URL = "http://192.168.29.76:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// Add token automatically to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
