import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import LinkPage from "./pages/LinkPage";
import Dashboard from "./pages/Dashboard";
import Redirect from "./pages/RedirectLink";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Toaster } from "@/components/ui/sonner";
import ResetPassword from "./pages/ResetPassword";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/auth", element: <Auth /> },
      { path: "/link/:id", element: <LinkPage /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <Login /> },
      { path: "/:id", element: <Redirect /> },
      { path: "/reset", element: <ResetPassword /> },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
