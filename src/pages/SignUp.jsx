import React, { useContext, useState } from "react";
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
import { auth, provider } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";
import * as Yup from "yup";
import UserContext from "../contexts/UserContext";

const SignUp = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { setUser } = useContext(UserContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setErrors({});

      const schema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be 6 characters long")
          .required("Password is required"),
      });

      await schema.validate(formData, { abortEarly: false });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.username });
      setUser({
        username: formData.username,
        profilePicUrl: "", // initially empty
      });

      toast("Account Created Successfully! You may login now.");
      await signOut(auth);
      navigate(`/login`);
    } catch (error) {
      const newErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
      }
      setErrors(newErrors);
      toast("ERROR: " + error.message);
    }
  };
  const googleAuth = () => {
    try {
      signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      toast("Error:" + error.message);
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="something"
                  required
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="m@example.com"
                  required
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <CardAction>
              <CardDescription>
                Already having an account?
                <Button
                  variant="link"
                  className="cursor-pointer"
                  onClick={() => navigate(`/login`)}>
                  Login
                </Button>
              </CardDescription>
            </CardAction>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full cursor-pointer">
              Sign up
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={googleAuth}>
              Sign up with Google
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default SignUp;
