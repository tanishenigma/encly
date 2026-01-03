import api from "../api/api";
import { UAParser } from "ua-parser-js";

export async function getClicks() {
  try {
    const response = await api.get("/clicks");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getClicksForUrl(url_id) {
  try {
    const response = await api.get(`/clicks/${url_id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }
}

const parser = new UAParser();

export async function storeClicks({ id, shortUrl }) {
  try {
    const res = parser.getResult();
    const device = res.device.type || "desktop";

    const response = await fetch("https://ipinfo.io/json?token=fb1c37b543d2e1");
    const data = await response.json();
    const { city, country } = data;

    await api.post(`/clicks/${shortUrl}`, {
      city,
      country,
      device,
    });
  } catch (error) {
    console.error("Error storing click:", error);
  }
}
