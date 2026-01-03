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
import { auth, provider, signInWithGoogle } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";
import { ArrowLeft, LinkIcon } from "lucide-react";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [click, setClick] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be 6 characters long")
          .required("Password is required"),
      });
      await schema.validate(formData, { abortEarly: false });

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      localStorage.setItem("session", JSON.stringify(user));
      if (user) {
        toast.success("Logged in successfully! 🎉");
        navigate("/");
      }
    } catch (error) {
      const newErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      }
      setErrors(newErrors);
      const errorMessage =
        error.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : error.message;

      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success("Reset link sent to your registered email address");
    } catch (error) {
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
  const googleAuth = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      toast("Error:" + error.message);
    }
  };

  return (
    <>
      {!showForgotPassword ? (
        <div className="md:mt-36 mt-5 flex flex-col items-center gap-10">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold ">
            <div className="flex flex-col items-center">
              <div
                className={`md:hidden w-20 h-20 rounded-full relative backdrop-blur-2xl border-slate-50/5 shadow-2xl shadow-black border-2 ${
                  click ? "bg-slate-950/30" : ""
                }  m-5 `}>
                <LinkIcon
                  className="w-15 h-15 p-2 absolute top-2 left-2 cursor-pointer "
                  onClick={() => {
                    setClick((prev) => !prev);
                    setTimeout(() => {
                      navigate("/");
                    }, 100);
                  }}
                />
              </div>
              Login
            </div>
          </h1>
          <form onSubmit={handleLogin}>
            <Card className="md:w-96 lg:w-full lg:min-w-md w-86 bg-slate-950/20 backdrop-blur-sm ">
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
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="abcd@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="cursor-pointer"
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}
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
                    className="m-0 p-0 pl-2 cursor-pointer"
                    variant="link"
                    type="button"
                    onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </CardDescription>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full cursor-pointer">
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  type="button"
                  onClick={googleAuth}>
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
            className="absolute top-8 left-5 md:top-10 md:left-5 text-sm md:text-xl font-semibold flex cursor-pointer items-center gap-2  bg-[#9b8afb]/20 p-2 rounded-md backdrop-blur-3xl"
            onClick={() => setShowForgotPassword(false)}>
            <ArrowLeft /> Back to login
          </button>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold">
            Forgot?🤔
          </h1>
          <form onSubmit={handleForgotPassword}>
            <Card className="md:w-full w-80 md:min-w-md  bg-slate-950/20 backdrop-blur-sm ">
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
                      value={formData.email}
                      onChange={handleInputChange}
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
