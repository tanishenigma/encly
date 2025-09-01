import React, { useEffect, useState } from "react";
import UserContext from "./UserContext.js";
import { storage } from "../lib/appwrite.js";
import { auth, db } from "../lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      const userRef = doc(db, "users", currentuser.uid);

      return onSnapshot(userRef, async (snapshot) => {
        const data = snapshot.data();

        if (data?.profilePicFileId) {
          const url = storage.getFileView(
            import.meta.env.VITE_APPWRITE_STORAGE_BUCKET,
            data.profilePicFileId,
            150,
            150,
            "center",
            80
          );
          setProfilePic(url);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profilePic }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
