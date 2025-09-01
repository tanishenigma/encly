// supabase/functions/firebase-auth/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client using the service role key (⚠️ never expose in frontend)
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// This function runs whenever your frontend calls /functions/v1/firebase-auth
serve(async (req) => {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return new Response(JSON.stringify({ error: "Missing idToken" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ⚡ Verify the Firebase token using Google’s secure API
    const verifyResp = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${Deno.env.get(
        "FIREBASE_API_KEY"
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    const verifyData = await verifyResp.json();
    if (!verifyResp.ok) {
      throw new Error(JSON.stringify(verifyData));
    }

    const userInfo = verifyData.users?.[0];
    if (!userInfo) {
      throw new Error("Invalid Firebase user");
    }

    const email = userInfo.email;
    const uid = userInfo.localId;

    // Ensure this user exists in Supabase
    await supabaseAdmin.auth.admin.createUser({
      email,
      user_metadata: { firebase_uid: uid },
    }).catch(() => {}); // ignore "already exists"

    // Create a Supabase session for this user
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (error) throw error;

    // Return the access_token + refresh_token to the frontend
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
