import api from "../api/api";

export async function getUserProfile() {
  const response = await api.get("/user/profile");
  return response.data;
}

export async function updateUserProfile(data) {
  const response = await api.put("/user/profile", data);
  return response.data;
}
