import supabase from "../db/supabase";
import { auth } from "../lib/firebase";
import { UAParser } from "ua-parser-js";

export async function getClicks() {
  const user = auth.currentUser;
  if (!user) throw new Error("User Not Authenticated");

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("user_id", user.uid);

  if (error) throw error;
  return data;
}

export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

export async function storeClicks({ id, originalUrl }) {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    const response = await fetch("https://ipinfo.io/json?token=fb1c37b543d2e1");
    const data = await response.json();
    const { city, country } = data;

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });
  } catch (error) {
    console.error("Error recording click:", error);
  }
}
