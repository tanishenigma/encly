import express from "express";
import fetch from "node-fetch";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ---------- Firebase Admin Setup ----------
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
});

// ---------- Supabase Settings ----------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;

// ---------- Endpoint: exchange Firebase ID token for Supabase session ----------
app.post("/auth/firebase", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ error: "Missing ID token" });

    // 1. Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // 2. Create or get user in Supabase
    const resp = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=id_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({
          provider: "firebase",
          id_token: idToken,
        }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Supabase error: ${err}`);
    }

    const supabaseSession = await resp.json();
    res.json(supabaseSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Start server ----------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
