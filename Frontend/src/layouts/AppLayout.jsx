import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import useScrollToTop from "../hooks/useScrollToTop";

const AppLayout = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const location = useLocation();
  const noOutletRoutes = ["/login", "/signup", "/auth"];
  const hideLayout = noOutletRoutes.includes(location.pathname);
  useScrollToTop();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black/50 ">
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-700 animate-pulse  duration-[10s]" />

        <div className="absolute inset-0 bg-gradient-to-br from-pink-950/60 via-transparent to-slate-900/80" />

        <div className="absolute inset-0 opacity-[0.02] bg-repeat" />
      </div>

      {!hideLayout && (
        <div className="relative z-50">
          <Header />
        </div>
      )}
      <main className="relative z-50 min-h-screen mx-auto container flex justify-center">
        <Outlet />

        {/* Gravitational circles */}
        <div
          className="absolute circlePosition rounded-full -z-50 bg-pink-300 w-[90%] h-[200%] overflow-y-hidden opacity-1 shadow-accent shadow-2xl bottom-90 
                     transition-transform duration-300 ease-out pointer-events-none"
          style={{
            transform: `translate(${mousePos.x * 15}px, ${
              mousePos.y * 10
            }px) scale(${1 + mousePos.x * 0.05})`,
          }}></div>

        <div
          className="absolute circlePosition rounded-full -z-50 bg-pink-400 w-[110%] h-[200%] overflow-y-hidden opacity-1 bottom-60
                     transition-transform duration-500 ease-out pointer-events-none"
          style={{
            transform: `translate(${mousePos.x * -12}px, ${
              mousePos.y * 8
            }px) scale(${1 + mousePos.y * 0.03}) rotate(${mousePos.x * 2}deg)`,
          }}></div>

        <div
          className="absolute circlePosition rounded-full -z-50 bg-pink-500 w-[130%] h-[200%] overflow-y-hidden opacity-1 bottom-35
                     transition-transform duration-700 ease-out pointer-events-none"
          style={{
            transform: `translate(${mousePos.x * 8}px, ${
              mousePos.y * -6
            }px) scale(${1 + mousePos.x * 0.02}) rotate(${
              mousePos.y * -1.5
            }deg)`,
          }}></div>
      </main>
      <footer className="flex flex-col justify-center items-center relative z-10 text-center p-10 text-slate-400 overflow-hidden">
        <Link
          to="https://github.com/tanishenigma"
          target="blank"
          className="bg-slate-400 h-5 w-5 rounded-full relative overflow-hidden hover:animate-bounce duration-1000 hover:scale-105">
          <img
            src="/github-icon.svg"
            className="w-6 h-6 absolute "
            loading="lazy"
            decoding="async"
            alt="Github Logo"
          />
        </Link>
        <h1 className="text-4xl font-black mb-2 text-slate-50 tracking-wider drop-shadow-lg">
          Encly
        </h1>
        <p className="drop-shadow-sm">
          Copyright © {currentYear} <span className="font-bold">Encly</span>
        </p>
        <p className="drop-shadow-sm">
          Made by <span className="font-bold">TanishEnigma</span> with 🖱 and ⌨
        </p>
      </footer>
    </div>
  );
};

export default AppLayout;
