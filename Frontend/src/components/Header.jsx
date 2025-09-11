import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut, User } from "lucide-react";
import UserContext from "../contexts/UserContext.js";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase.js";

const Header = () => {
  const { user, profilePic } = useContext(UserContext);
  const username = String(user?.displayName || "");
  const displayUserName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : "";
  const navigate = useNavigate();

  const [storedPic, setStoredPic] = useState(null);

  // Convert & save profile pic in localStorage
  async function saveProfilePic(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      localStorage.setItem("profilePic", base64Image);
      setStoredPic(base64Image); // update state
    } catch (error) {
      console.error("Error saving profile picture:", error);
    }
  }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("profilePic");
    if (saved) {
      setStoredPic(saved);
    } else if (profilePic) {
      saveProfilePic(profilePic); // first-time save
    }
  }, [profilePic]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("profilePic");
    setStoredPic(null);
    navigate("/");
  };

  return (
    <nav className="py-4 px-2 mx-2 md:mx-15 flex justify-between items-center">
      <div className="w-15 h-15 rounded-full relative backdrop-blur-2xl border-slate-50/5 shadow-2xl shadow-black border-2 hover:bg-pink-950 ">
        <LinkIcon
          onClick={() => {
            navigate("/");
          }}
          className="w-10 h-10 p-2 absolute top-2 left-2 cursor-pointer "
        />
      </div>

      {!user ? (
        <Button
          onClick={() => {
            navigate("/login");
          }}
          className="cursor-pointer">
          Login
        </Button>
      ) : (
        <DropdownMenu modal={false} className="cursor-pointer ">
          <DropdownMenuTrigger className="cursor-pointer ">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={storedPic || profilePic} // ✅ Load from localStorage first
                className="object-cover w-10 h-10"
                alt="profile-picture"
              />
              <AvatarFallback>
                {username ? username.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-slate-950/30 border-slate-600/20 backdrop-blur-sm ">
            <DropdownMenuLabel className="text-center">
              Hi, {displayUserName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-600/20 " />
            <DropdownMenuItem
              className="cursor-pointer "
              onClick={() => {
                navigate("/dashboard");
              }}>
              <User />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigate("/link");
              }}>
              <LinkIcon />
              <span>My Links</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 " />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default Header;
