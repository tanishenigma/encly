import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        toast.success("Logged in successfully! 🎉");
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : error.message;

      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent to your registered email address");
      // Keep user on forgot password screen so they can see the success message
      // and try again if needed, rather than auto-navigating back
    } catch (error) {
      // Handle specific Firebase auth errors for better UX
      let errorMessage = "Failed to send reset email";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <>
      {!showForgotPassword ? (
        <div className="mt-36 flex flex-col items-center gap-10">
          <h1 className="text-8xl font-extrabold">Login</h1>
          <form onSubmit={handleLogin}>
            <Card className="w-full min-w-md">
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
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
                      placeholder="abcd@example.com"
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
                  <button
                    type="button"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                    onClick={() => setShowForgotPassword(true)}>
                    Forgot your password?
                  </button>
                </div>

                <CardDescription className="mt-4 text-right">
                  Don't have an account?
                  <Button
                    className="m-0 p-0 pl-2"
                    variant="link"
                    type="button"
                    onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </CardDescription>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  Login with Google
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      ) : (
        <div className="mt-36 flex flex-col items-center gap-10">
          <button
            type="button"
            className="absolute top-10 left-10 text-xl font-semibold flex cursor-pointer items-center gap-2  bg-[#9b8afb]/20 p-2 rounded-xl backdrop-blur-3xl"
            onClick={() => setShowForgotPassword(false)}>
            <ArrowLeft /> Back to login
          </button>

          <h1 className="text-8xl font-extrabold">Forgot?</h1>
          <form onSubmit={handleForgotPassword}>
            <Card className="w-full min-w-md">
              <CardHeader>
                <CardTitle>Enter the Email Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="abcd@example.com"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
