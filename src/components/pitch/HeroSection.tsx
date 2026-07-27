"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight } from "lucide-react";
import { KineticWord } from "./KineticWord";

const WarmParticleCanvas = dynamic(
  () => import("@/components/WarmParticleCanvas").then((m) => m.WarmParticleCanvas),
  { ssr: false },
);

interface HeroSectionProps {
  onApplyClick: () => void;
  onLearnMoreClick: () => void;
}

export function HeroSection({ onApplyClick, onLearnMoreClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-gradient grid-pattern-dark"
    >
      {/* Particle canvas */}
      <WarmParticleCanvas />

      {/* Radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(139,69,19,0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2.5 mb-8">
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium tracking-[0.15em] uppercase"
            style={{
              borderColor: "rgba(210,160,100,0.25)",
              background: "rgba(210,160,100,0.07)",
              color: "#D4A06A",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#D4A06A", boxShadow: "0 0 6px rgba(210,160,100,0.8)" }}
            />
            Nana Dwumfuoh · Healthworx Capital
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[1.0] mb-6"
          style={{ letterSpacing: "-0.03em", color: "#F5E6D3" }}
        >
          We back the next
          <br />
          generation of
          <br />
          <KineticWord />
        </h1>

        {/* Subtext */}
        <p
          className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed text-pretty"
          style={{ color: "rgba(245,230,211,0.65)" }}
        >
          Connecting visionary healthcare founders with capital and strategic partnerships.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onApplyClick}
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #5C2D12 0%, #A0522D 100%)",
              color: "#F5E6D3",
              boxShadow: "0 0 0 1px rgba(210,160,100,0.2), 0 4px 24px rgba(92,45,18,0.4)",
            }}
          >
            Submit Your Pitch
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLearnMoreClick}
            className="px-8 py-3.5 rounded-full text-base font-semibold transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
            style={{
              border: "1px solid rgba(245,230,211,0.25)",
              color: "rgba(245,230,211,0.85)",
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onLearnMoreClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity hover:opacity-80"
        aria-label="Scroll down"
      >
        <span
          className="text-xs tracking-[0.15em] uppercase font-medium"
          style={{ color: "rgba(210,160,100,0.5)" }}
        >
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 animate-bounce" style={{ color: "rgba(210,160,100,0.5)" }} />
      </button>
    </section>
  );
}
