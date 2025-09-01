import supabase from "../db/supabase";
import { auth } from "../lib/firebase";
export async function getClicks() {
  const user = auth.currentUser;
  if (!user) throw new Error("User Not Authenticated");
  const { clickData, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("user_id", user.uid);
  if (error) throw error;

  return clickData;
}
