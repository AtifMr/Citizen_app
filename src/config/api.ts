import axios from "axios";

// Replace with your computer's LAN IP
const API_URL = "http://192.168.29.76:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,  // optional: fail faster if network issue
});

export default api;
