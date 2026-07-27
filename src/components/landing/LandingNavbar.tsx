"use client";

import { useState, useEffect } from "react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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
          ? "bg-white shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2"
        >
          <span className="w-7 h-7 bg-[#14532D] rounded flex items-center justify-center text-white text-xs font-bold">
            N
          </span>
          <span
            className={`font-semibold tracking-tight text-sm transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            NDC
          </span>
        </button>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { id: "about", label: "About" },
            { id: "focus", label: "Focus" },
            { id: "submit", label: "Submit" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                scrolled ? "text-gray-600" : "text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo("submit")}
          className="bg-[#14532D] hover:bg-[#166534] text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
        >
          Submit Your Deck →
        </button>
      </div>
    </nav>
  );
}
