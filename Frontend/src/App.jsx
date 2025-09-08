import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import LinkPage from "./pages/LinkPage";
import Dashboard from "./pages/Dashboard";
import Redirect from "./pages/Redirect";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UserContextProvider from "./contexts/UserContextProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAuth from "./components/ProtectedAuth";
import AuthContextProvider from "./contexts/AuthContextProvider";
import { Toaster } from "@/components/ui/sonner";
import Link from "./pages/Link";
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth",
        element: (
          <ProtectedAuth>
            <Auth />{" "}
          </ProtectedAuth>
        ),
      },
      {
        path: "/link/",
        element: (
          <ProtectedRoute>
            <LinkPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/link/:id",
        element: (
          <ProtectedRoute>
            <Link />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedAuth>
            <SignUp />
          </ProtectedAuth>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedAuth>
            {" "}
            <Login />
          </ProtectedAuth>
        ),
      },
      { path: "/:id", element: <Redirect /> },
      { path: "/reset", element: <ResetPassword /> },
    ],
  },
]);
function App() {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </UserContextProvider>
    </AuthContextProvider>
  );
}

export default App;
