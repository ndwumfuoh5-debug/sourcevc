"use client";

import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0D1117] overflow-hidden">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-800/50 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-green-400">
            Healthcare Ventures · Deal Sourcing
          </span>
        </div>

        {/* H1 */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white mb-6">
          Sourcing the next generation of{" "}
          <span className="text-green-400">health innovation.</span>
        </h1>

        {/* Subline */}
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10 text-pretty">
          I&apos;m an early-stage investor focused on healthcare and health-tech.
          I partner with founders building solutions in digital health, AI/ML in
          healthcare, and payer-provider infrastructure. If you&apos;re building
          something that matters, I want to hear from you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollTo("submit")}
            className="bg-[#14532D] hover:bg-[#166534] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-green-900/30 hover:scale-[1.02] text-base"
          >
            Submit Your Deck →
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium px-8 py-3.5 rounded-full transition-all duration-200 text-base"
          >
            Learn More ↓
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" style={{ animationDuration: "1.5s" }} />
      </div>
    </section>
  );
}
