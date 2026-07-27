"use client";

import { useState, useEffect } from "react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div
        className={`rounded-2xl transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm border border-white/60"
            : "bg-white/20 backdrop-blur-sm border border-white/30"
        }`}
      >
        <div className="flex items-center h-14 px-5">
          {/* Logo pill */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black/85 text-white font-semibold text-xs tracking-widest uppercase px-5 py-2 rounded-full mr-8 hover:bg-black transition-colors"
          >
            NDC
          </button>

          {/* Nav links */}
          <div className="flex items-center gap-8 flex-1">
            {[
              { id: "about", label: "about" },
              { id: "focus", label: "focus" },
              { id: "submit", label: "submit" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm text-gray-500 hover:text-black transition-colors tracking-wide"
              >
                {label}
              </button>
            ))}
          </div>

          {/* CTA — rounded pill */}
          <button
            onClick={() => scrollTo("submit")}
            className="bg-black text-white text-xs font-semibold tracking-widest uppercase px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            Submit deck
          </button>
        </div>
      </div>
    </nav>
  );
}
