import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="mt-36 flex flex-col items-center gap-10">
      {user ? (
        <>
          <h1 className="text-4xl font-bold">Welcome, {user.email}</h1>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </>
      ) : (
        <>
          {!searchParams.get("createNew") ? (
            <>
              {" "}
              <h1 className="text-4xl font-bold">Hold Up! Let's Login First</h1>
              <Button
                className="cursor-pointer w-50"
                onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                className="cursor-pointer w-50"
                onClick={() => navigate("/signup")}
                variant="outline">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              {" "}
              <h1 className="text-4xl font-bold">Login</h1>
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/signup")} variant="outline">
                Sign Up
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Auth;
