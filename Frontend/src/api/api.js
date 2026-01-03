import axios from "axios";
import { auth } from "../lib/firebase";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`, // Adds /api here
});

api.interceptors.request.use(async (config) => {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    console.warn("API Request made without authenticated user");
  }
  return config;
});

export default api;
