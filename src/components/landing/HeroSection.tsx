"use client";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #dce8f5 0%, #e8f0f8 45%, #f0f4f8 100%)",
      }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: 600,
            height: 600,
            top: "-10%",
            right: "-8%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: 400,
            height: 400,
            bottom: "5%",
            left: "-5%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: 250,
            height: 250,
            top: "40%",
            left: "30%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

          {/* Left — 60% */}
          <div className="flex-1 lg:max-w-[58%]">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/70 backdrop-blur border border-white/80 text-slate-500 text-xs px-4 py-1.5 rounded-full mb-8">
              Early-Stage · Health &amp; Health-Tech
            </div>

            {/* Headline */}
            <h1
              className="font-bold text-[#1a1f2e] leading-tight tracking-tight mb-6"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Sourcing the next generation of health innovation.
            </h1>

            {/* Subtext */}
            <p className="text-slate-500 text-lg leading-relaxed max-w-prose mb-10 text-pretty">
              I personally review every submission — no filters, no automated
              rejections. If you&apos;re building in digital health, AI in
              healthcare, or payer-provider infrastructure, I want to hear your
              story.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo("submit")}
                className="bg-[#1a1f2e] text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-slate-700 transition-colors"
              >
                Submit Your Deck →
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="border border-slate-300 text-slate-600 rounded-full px-7 py-3.5 text-sm font-medium hover:border-slate-400 hover:text-slate-800 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right — 40%: frosted glass stats card */}
          <div className="lg:max-w-[38%] w-full">
            <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl p-8 space-y-6">
              {[
                {
                  icon: "🏥",
                  label: "Stage",
                  value: "Pre-seed → Series A",
                },
                {
                  icon: "🌍",
                  label: "Geography",
                  value: "US-focused",
                },
                {
                  icon: "⏱",
                  label: "Response",
                  value: "Within 2 weeks",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-5 p-4 bg-white/60 rounded-2xl border border-white/70"
                >
                  <div className="w-11 h-11 rounded-full bg-white/80 border border-white/90 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold text-[#1a1f2e]">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
