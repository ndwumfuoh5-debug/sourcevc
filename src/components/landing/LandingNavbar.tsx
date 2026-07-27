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
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled ? "bg-white border-b border-gray-200" : "bg-transparent"
        }`}
      >
        <div className="flex items-center h-16">
          {/* Black logo block — split design */}
          <div className="bg-black h-16 flex items-center px-8 shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-white font-bold text-sm tracking-widest uppercase"
            >
              NDC
            </button>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-10 px-10 flex-1">
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

          {/* CTA */}
          <div className="px-8">
            <button
              onClick={() => scrollTo("submit")}
              className="bg-black text-white text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Submit deck
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
