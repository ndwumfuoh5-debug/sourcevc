"use client";

import { useEffect, useRef } from "react";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-[#D6E4F0] overflow-hidden flex flex-col">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 40%, #b8d4e8 0%, transparent 60%), radial-gradient(circle at 20% 80%, #c9dceb 0%, transparent 50%)",
        }}
      />

      {/* Vertical rotated label — right side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-black/30" />
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-black/40 font-medium"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Healthcare Ventures
        </span>
        <div className="w-px h-16 bg-black/30" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24 pb-16 max-w-6xl">
        {/* Small label */}
        <p className="text-xs tracking-[0.25em] uppercase text-black/50 mb-10 font-medium">
          Early-stage investor · Health &amp; Health-Tech
        </p>

        {/* Giant headline */}
        <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.92] tracking-[-0.03em] text-black mb-8 lowercase">
          sourcing the
          <br />
          next wave of
          <br />
          <span className="text-black/40">health</span> innovation.
        </h1>

        {/* Decorative arrow line */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-black flex-1 max-w-[120px]" />
          <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
            <path d="M0 7h22M16 1l6 6-6 6" stroke="black" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Bio text */}
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md mb-12 text-pretty">
          I partner with founders building solutions in digital health, AI in
          healthcare, and payer-provider infrastructure. Every deck is personally
          reviewed.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollTo("submit")}
            className="bg-black text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-gray-800 transition-colors"
          >
            Submit your deck
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="text-sm text-black/60 hover:text-black underline underline-offset-4 transition-colors"
          >
            Learn more ↓
          </button>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="flex items-center gap-3 px-8 md:px-16 lg:px-24 pb-10">
        <div className="w-4 h-4 border border-black/30 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-black/40 rounded-full" />
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase text-black/40">Scroll to explore</span>
      </div>
    </section>
  );
}
