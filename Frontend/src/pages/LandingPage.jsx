import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../components/ui/button";
import { auth } from "../lib/firebase";
import Doubts from "../components/Doubts";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const user = auth.currentUser;

  const handleUrl = (e) => {
    e.preventDefault();
    if (!user) {
      if (longUrl) navigate(`auth?/createNew=${longUrl}`);
    } else navigate(`/link?createNew=${encodeURIComponent(longUrl)}`);
  };
  return (
    <div className="flex flex-col ">
      <div className="flex flex-col justify-center gap-y-2.5 mt-40 tracking-wider">
        <h1 className="sm:text-8xl md:text-10xl text-8xl font-black">Encly,</h1>
        <p className="sm:text-xl md:text-md  dark:text-slate-400 text-right ">
          snip it safe.
        </p>
        <form
          className="flex flex-col gap-y-5 mt-20 items-center"
          onSubmit={handleUrl}>
          <Input
            placeholder="Paste Your Lynk"
            value={longUrl}
            onChange={(e) => {
              setLongUrl(e.target.value);
            }}
          />
          <Button className="cursor-pointer text-slate-50 w-full backdrop-blur-5xl ">
            Encly
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
