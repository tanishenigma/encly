import api from "../api/api";

export async function createShortUrl({ originalUrl, customUrl, title, qr }) {
  try {
    const response = await api.post("/urls", {
      originalUrl,
      customUrl,
      title,
      qr,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create short URL"
    );
  }
}

export async function getUserUrls() {
  try {
    const response = await api.get("/urls");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getLongUrl(id) {
  try {
    const response = await api.get(`/urls/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUrl(id) {
  try {
    const response = await api.delete(`/urls/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
