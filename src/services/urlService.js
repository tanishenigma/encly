import supabase from "../db/supabase";
import { auth } from "../lib/firebase";

export async function createShortUrl({ originalUrl, customUrl, title, qr }) {
  const user = auth.currentUser;
  if (!user) throw new Error("User Not Authenticated!");

  const shortUrl = customUrl || Math.random().toString(36).substring(2, 8);

  const { data, error } = await supabase
    .from("urls")
    .insert({
      originalUrl,
      shortUrl,
      customUrl,
      user_id: user.uid,
      title,
      qr,
    })
    .select("*");

  if (error) throw error;
  return data[0];
}

export async function getUserUrls() {
  const user = auth.currentUser;

  if (!user) throw new Error("User Not Authenticated!");
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user.uid);
  if (error) throw error;

  return data;
}
