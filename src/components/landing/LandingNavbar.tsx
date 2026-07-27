"use client";

import { useEffect, useState } from "react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/50 backdrop-blur-xl border-b border-white/60 shadow-sm"
          : "bg-white/30 backdrop-blur-md border-b border-white/40"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6 md:px-10">
        {/* Left: initials pill */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#1a1f2e] text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-slate-700 transition-colors tracking-wide"
        >
          NDC
        </button>

        {/* Center: nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: "about", label: "about" },
            { id: "focus", label: "focus areas" },
            { id: "submit", label: "submit" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right: CTA pill */}
        <button
          onClick={() => scrollTo("submit")}
          className="bg-[#1a1f2e] text-white rounded-full px-5 py-2 text-xs font-semibold hover:bg-slate-700 transition-colors"
        >
          Submit your deck
        </button>
      </div>
    </nav>
  );
}
