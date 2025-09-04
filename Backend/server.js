const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const admin = require("firebase-admin");
const app = express();

app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("./path-to-firebase-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Supabase with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Endpoint to exchange and validate Firebase token
app.post("/auth/firebase", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    // Verify Firebase JWT
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken, true); // true enables revocation check
    } catch (error) {
      return res
        .status(401)
        .json({
          error: "Invalid or revoked Firebase JWT",
          details: error.message,
        });
    }

    // Extract claims
    const { email, uid: firebase_uid, exp, iss, aud } = decodedToken;

    // Additional validation
    const expectedIssuer = `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`;
    const expectedAudience = process.env.FIREBASE_PROJECT_ID;
    const currentTime = Math.floor(Date.now() / 1000);

    if (iss !== expectedIssuer) {
      return res
        .status(401)
        .json({
          error: `Invalid issuer: expected ${expectedIssuer}, got ${iss}`,
        });
    }
    if (aud !== expectedAudience) {
      return res
        .status(401)
        .json({
          error: `Invalid audience: expected ${expectedAudience}, got ${aud}`,
        });
    }
    if (exp < currentTime) {
      return res.status(401).json({ error: "Token expired" });
    }
    if (!firebase_uid) {
      return res.status(401).json({ error: "No user ID in token" });
    }

    // Ensure user exists in Supabase
    let { data: user, error } = await supabase.auth.admin.createUser({
      email,
      user_metadata: { firebase_uid },
    });

    if (error && error.message.includes("already exists")) {
      ({ data: user, error } = await supabase.auth.admin.getUserByEmail(email));
    }
    if (error) throw error;

    // Generate a Supabase session
    const { data: session, error: sessionError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
      });

    if (sessionError) throw sessionError;

    // Optionally, upsert profile in urls table
    await supabase.from("urls").upsert(
      {
        user_id: firebase_uid,
        email,
      },
      { onConflict: "user_id" }
    );

    res.json({ access_token: session.properties.action_link, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
