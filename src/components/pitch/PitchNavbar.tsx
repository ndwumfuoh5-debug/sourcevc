"use client";

import { useEffect, useState } from "react";

interface PitchNavbarProps {
  onApplyClick: () => void;
}

export function PitchNavbar({ onApplyClick }: PitchNavbarProps) {
  const [onDark, setOnDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnDark(entry?.isIntersecting ?? true);
      },
      { threshold: 0.15 },
    );
    observer.observe(heroEl);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: onDark ? "transparent" : "rgba(255,255,255,0.97)",
        backdropFilter: onDark ? "none" : "blur(12px)",
        borderBottom: onDark ? "none" : "1px solid rgba(139,69,19,0.08)",
        boxShadow: !onDark && scrolled ? "0 1px 20px rgba(28,15,7,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark — just a minimal dot */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#D4A06A" }}
            aria-hidden="true"
          />
          <span
            className="text-sm font-semibold tracking-[0.18em] uppercase"
            style={{ color: onDark ? "rgba(245,230,211,0.7)" : "#1C0F07" }}
          >
            VC Portal
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={onApplyClick}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #5C2D12 0%, #A0522D 100%)",
            color: "#F5E6D3",
            boxShadow: "0 0 0 1px rgba(210,160,100,0.2), 0 2px 12px rgba(92,45,18,0.3)",
          }}
        >
          Submit Pitch
        </button>
      </div>
    </nav>
  );
}
