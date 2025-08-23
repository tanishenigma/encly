import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        toast("Account Created Successfully! You may login now.");
        navigate(`/login`);
      }
    } catch (error) {
      toast("ERROR:", error.message);
    }
  };
  return (
    <div className="mt-36 flex flex-col items-center gap-10">
      <h1 className="text-8xl font-extrabold">Signup</h1>
      <form onSubmit={handleSignUp}>
        <Card className="w-full min-w-md">
          <CardHeader>
            <CardTitle>Create a new account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <CardAction>
              <CardDescription>
                Already having an account?
                <Button
                  variant="link"
                  onClick={() => {
                    navigate(`/login`);
                  }}>
                  Login
                </Button>
              </CardDescription>
            </CardAction>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Sign up
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with Google
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SignUp;
