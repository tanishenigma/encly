import supabase from "../db/supabase";
import { auth } from "../lib/firebase";

export async function createShortUrl({ originalUrl, customUrl, title, qr }) {
  const user = auth.currentUser;
  if (!user) throw new Error("User Not Authenticated!");

  const shortUrl = customUrl || Math.random().toString(36).substring(2, 8);

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        original_url: originalUrl,
        short_url: shortUrl,
        custom_url: customUrl || null,
        user_id: user.uid,
        title: title ?? null,
        qr: qr ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create short URL");
  }

  return data;
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

export async function getLongUrl(id) {
  const user = auth.currentUser;
  if (!user) throw new Error("User Not Authenticated!");

  const { data, error } = await supabase
    .from("urls")
    .select("id,original_url")
    .or(`short_url.eq.${id},custom_url.eq${id}`)
    .single();

  if (error) throw error;

  return data;
}
