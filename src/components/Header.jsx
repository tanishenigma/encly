import React, { useContext } from "react";
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
import UserContext from "../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase.js";

const Header = () => {
  const { user, profilePic } = useContext(UserContext);
  const username = String(user?.displayName);
  const displayUserName = username.charAt(0).toUpperCase() + username.slice(1);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="py-4 mx-15 flex justify-between items-center">
      <div className="w-15 h-15 rounded-full relative backdrop-blur-2xl border-slate-50/5 shadow-2xl shadow-black border-2 hover:bg-pink-950 cursor-pointer">
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
        <DropdownMenu className="cursor-pointer">
          <DropdownMenuTrigger>
            <Avatar className="w-10 h-10">
              <AvatarImage src={profilePic} />
              <AvatarFallback>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-center">
              Hi, {displayUserName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigate("/dashboard");
              }}>
              <User />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate("/links");
              }}>
              <LinkIcon />
              <span>My Links</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
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
