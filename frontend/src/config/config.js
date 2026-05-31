// Override in production: VITE_API_URL=https://your-api.onrender.com
const devUrl = "http://localhost:5000";
const prodUrl =
  import.meta.env.VITE_API_URL || "https://pvms.onrender.com";

export const API_URL =
  import.meta.env.MODE === "production" ? prodUrl : devUrl;