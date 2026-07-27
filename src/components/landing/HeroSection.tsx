"use client";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen bg-[#D6E4F0] overflow-hidden flex flex-col">
      {/* Soft gradient overlays */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 75% 35%, #bcd8ed 0%, transparent 55%), radial-gradient(ellipse at 15% 75%, #c5dcea 0%, transparent 50%)",
        }}
      />

      {/* Vertical rotated label — right side */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-black/20" />
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-black/30 font-medium"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Healthcare Ventures
        </span>
        <div className="w-px h-16 bg-black/20" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-16 max-w-6xl">
        {/* Small label */}
        <p
          className="text-xs tracking-[0.3em] uppercase mb-10 font-medium"
          style={{ color: "rgba(0,0,0,0.45)" }}
        >
          Early-stage investor · Health &amp; Health-Tech
        </p>

        {/* Giant headline — outlined white/cream letters, softer serif feel */}
        <h1
          className="leading-[0.95] mb-8 lowercase"
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "clamp(3.8rem, 10.5vw, 8.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "rgba(255,252,245,0.92)",
            WebkitTextStroke: "1.5px rgba(0,0,0,0.75)",
            paintOrder: "stroke fill",
          }}
        >
          sourcing the
          <br />
          next wave of
          <br />
          <span
            style={{
              color: "rgba(255,252,245,0.45)",
              WebkitTextStroke: "1.5px rgba(0,0,0,0.35)",
            }}
          >
            health
          </span>{" "}
          innovation.
        </h1>

        {/* Decorative arrow line */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-black/30 flex-1 max-w-[100px]" />
          <svg width="22" height="12" viewBox="0 0 24 14" fill="none">
            <path d="M0 7h22M16 1l6 6-6 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Bio text */}
        <p
          className="text-base md:text-lg leading-relaxed max-w-md mb-12 text-pretty"
          style={{ color: "rgba(0,0,0,0.55)", fontFamily: "'Georgia', serif" }}
        >
          I partner with founders building solutions in digital health, AI in
          healthcare, and payer-provider infrastructure. Every deck is personally
          reviewed.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollTo("submit")}
            className="bg-black text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
          >
            Submit your deck
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="text-sm hover:opacity-80 underline underline-offset-4 transition-opacity"
            style={{ color: "rgba(0,0,0,0.5)", fontFamily: "'Georgia', serif" }}
          >
            Learn more ↓
          </button>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="flex items-center gap-3 px-8 md:px-16 lg:px-24 pb-10">
        <div className="w-4 h-4 border border-black/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-black/30 rounded-full" />
        </div>
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(0,0,0,0.35)" }}>
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
