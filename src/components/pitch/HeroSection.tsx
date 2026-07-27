"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";

const WarmParticleCanvas = dynamic(
  () => import("@/components/WarmParticleCanvas").then((m) => m.WarmParticleCanvas),
  { ssr: false },
);

interface HeroSectionProps {
  onApplyClick: () => void;
}

export function HeroSection({ onApplyClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-gradient grid-pattern-dark"
    >
      {/* Particle canvas */}
      <WarmParticleCanvas />

      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(139,69,19,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Main headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-[88px] font-extrabold leading-[1.0] mb-7 text-pretty"
          style={{ letterSpacing: "-0.035em", color: "#F5E6D3" }}
        >
          Share your
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #D4A06A 0%, #F5D6A8 50%, #D4A06A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            vision.
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl max-w-md mx-auto mb-10 leading-relaxed text-pretty"
          style={{ color: "rgba(245,230,211,0.5)" }}
        >
          We review every pitch personally. Submit your deck and we'll be in touch.
        </p>

        {/* CTA */}
        <button
          onClick={onApplyClick}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #5C2D12 0%, #A0522D 100%)",
            color: "#F5E6D3",
            boxShadow: "0 0 0 1px rgba(210,160,100,0.2), 0 4px 24px rgba(92,45,18,0.4)",
          }}
        >
          Submit Your Pitch
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle bottom fade into the form section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #FDFAF7)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
