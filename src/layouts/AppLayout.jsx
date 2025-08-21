import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
const AppLayout = () => {
  return (
    <div>
      {/* {Header} */}
      <Header />
      <main className="min-h-screen mx-auto container flex justify-center ">
        <Outlet />
      </main>

      {/* {Footer} */}
      <footer className="text-center mt-10 p-10 text-slate-400">
        <h1 className="text-4xl font-black mb-2 text-slate-50">Encly</h1>
        <p>
          Copyright © 2025 <span className="font-bold">Encly</span>
        </p>
        <p>
          Made by <span className="font-bold">TanishEnigma</span> with 🖱️ & ⌨️
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
