import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import supabase from "../db/supabase";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: "1:30356581801:web:0b2fc97f162ad30f46e8b8",
  measurementId: "G-5GBLHGL26C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth, provider };

async function exchangeIdToken(idToken) {
  const resp = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/firebase-auth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(
      `Supabase bridge failed (${resp.status}): ${JSON.stringify(err)}`
    );
  }

  const { access_token, refresh_token, expires_in } = await resp.json();

  // Store the session in the already-created Supabase client
  await supabase.auth.setSession({
    access_token,
    refresh_token,
    expires_in,
  });
}
export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, provider);
  const idToken = await cred.user.getIdToken(true);
  await exchangeIdToken(idToken);

  // At this point `supabase` holds a valid session and can be used anywhere
  return cred.user;
}

// ---------- Optional sign-out that clears both SDKs ----------
export async function signOutAll() {
  await auth.signOut();
  await supabase.auth.signOut();
}
