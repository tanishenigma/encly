import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import LinkPage from "./pages/LinkPage";
import Dashboard from "./pages/Dashboard";
import Redirect from "./pages/RedirectLink";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/landing", element: <LandingPage /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/auth", element: <Auth /> },
      { path: "/link/:id", element: <LinkPage /> },
      { path: "/:id", element: <Redirect /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
