import React, { useState, useEffect } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../lib/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidCode, setIsValidCode] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  useEffect(() => {
    const validateResetCode = async () => {
      if (!oobCode || mode !== "resetPassword") {
        toast.error("Invalid or expired reset link");
        navigate("/login");
        return;
      }

      try {
        const email = await verifyPasswordResetCode(auth, oobCode);
        setUserEmail(email);
        setIsValidCode(true);
        setIsValidating(false);
      } catch (error) {
        let errorMessage = "Invalid or expired reset link";

        switch (error.code) {
          case "auth/expired-action-code":
            errorMessage =
              "This reset link has expired. Please request a new one";
            break;
          case "auth/invalid-action-code":
            errorMessage =
              "This reset link is invalid. Please request a new one";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled";
            break;
        }

        toast.error(errorMessage);
        setIsValidating(false);
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    validateResetCode();
  }, [oobCode, mode, navigate]);

  const validatePassword = (pwd) => {
    return pwd.length >= 6; // Firebase minimum requirement
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("Password reset successfully! 🎉");

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      let errorMessage = "Failed to reset password";

      switch (error.code) {
        case "auth/expired-action-code":
          errorMessage = "Reset link has expired. Please request a new one";
          break;
        case "auth/invalid-action-code":
          errorMessage = "Invalid reset link. Please request a new one";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password";
          break;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length === 0) return { strength: "", color: "" };
    if (pwd.length < 6) return { strength: "Too short", color: "text-red-500" };
    if (pwd.length < 8) return { strength: "Weak", color: "text-orange-500" };
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      return { strength: "Strong", color: "text-green-500" };
    }
    return { strength: "Fair", color: "text-yellow-500" };
  };

  if (isValidating) {
    return (
      <div className="mt-36 flex flex-col items-center gap-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="text-lg">Validating reset link...</p>
      </div>
    );
  }

  if (!isValidCode) {
    return (
      <div className="mt-36 flex flex-col items-center gap-10">
        <h1 className="text-8xl font-extrabold text-red-500">Invalid</h1>
        <p className="text-lg text-gray-600">
          This reset link is invalid or has expired.
        </p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="mt-36 flex flex-col items-center gap-10">
      <Button
        variant="ghost"
        className="absolute top-10 left-10 text-xl font-semibold flex cursor-pointer items-center gap-2"
        onClick={() => navigate("/login")}>
        <ArrowLeft /> Back to login
      </Button>

      <h1 className="text-8xl font-extrabold">Reset</h1>

      <form onSubmit={handleResetPassword}>
        <Card className="w-full min-w-md">
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>
              Enter a new password for {userEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {password && (
                  <p className={`text-sm ${passwordStrength.color}`}>
                    Password strength: {passwordStrength.strength}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className="text-sm text-green-500">
                          Passwords match
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-red-500">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Consider including uppercase, lowercase, and numbers</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || !password || !confirmPassword || !passwordsMatch
              }>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ResetPassword;
