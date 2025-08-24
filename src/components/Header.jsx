import React, { useEffect, useState } from "react";
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
import { LinkIcon, LogOut } from "lucide-react";
import { auth } from "../lib/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const username = String(user?.displayName);
  const displayUserName = username.charAt(0).toUpperCase() + username.slice(1);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });
    return () => unsubscribe();
  }, []);

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
            <Avatar>
              <AvatarImage src={user.photoURL} />
              <AvatarFallback>PFP</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-center">
              Hi, {displayUserName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
