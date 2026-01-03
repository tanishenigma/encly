import React, { useEffect, useState } from "react";
import UserContext from "./UserContext.js";
import { auth } from "../lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "../services/userService.js";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      if (profile && profile.profile_picture) {
        setProfilePic(profile.profile_picture);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);
      if (currentuser) {
        await fetchUserProfile();
      } else {
        setProfilePic(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profilePic, setProfilePic }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
