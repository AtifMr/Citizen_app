import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.76:5000", // ⚠️ Replace YOUR_IP with your machine IP
});

export default api;
