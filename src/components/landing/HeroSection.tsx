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
          "linear-gradient(135deg, #c8dff5 0%, #dce8f5 25%, #e8d5f0 50%, #d5e8f5 75%, #c5d8f0 100%)",
        backgroundSize: "400% 400%",
        animation: "aurora 8s ease-in-out infinite alternate",
      }}
    >
      {/* Blurred orbs */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Orb 1 */}
        <div
          className="absolute"
          style={{
            width: 700,
            height: 700,
            top: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(180,210,255,0.6) 0%, rgba(200,190,255,0.3) 40%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "float 7s ease-in-out infinite alternate",
          }}
        />
        {/* Orb 2 */}
        <div
          className="absolute"
          style={{
            width: 500,
            height: 500,
            bottom: "-10%",
            left: "-8%",
            background:
              "radial-gradient(circle, rgba(210,180,255,0.5) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(50px)",
            animation: "float 9s ease-in-out infinite alternate-reverse",
          }}
        />
        {/* Orb 3 */}
        <div
          className="absolute"
          style={{
            width: 350,
            height: 350,
            top: "30%",
            left: "20%",
            background:
              "radial-gradient(circle, rgba(180,230,240,0.4) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            animation: "float 11s ease-in-out infinite",
          }}
        />
        {/* Orb 4 */}
        <div
          className="absolute"
          style={{
            width: 250,
            height: 250,
            top: "10%",
            left: "55%",
            background:
              "radial-gradient(circle, rgba(255,200,180,0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(35px)",
            animation: "float 6s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Main glass panel */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16">
        <div
          className="p-10 md:p-16"
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow:
              "0 8px 32px rgba(100,120,180,0.15), inset 0 1px 0 rgba(255,255,255,0.7)",
            borderRadius: "2.5rem",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

            {/* Left — 60% */}
            <div className="flex-1 lg:max-w-[58%]">
              {/* Badge */}
              <div
                className="inline-flex items-center text-slate-500 text-xs px-4 py-1.5 rounded-full mb-8"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.7)",
                }}
              >
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
                  className="text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{
                    background: "rgba(26,31,46,0.85)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  Submit your deck →
                </button>
                <button
                  onClick={() => scrollTo("about")}
                  className="text-slate-700 rounded-full px-7 py-3.5 text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{
                    background: "rgba(255,255,255,0.4)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right — 40%: stat cards */}
            <div className="lg:max-w-[38%] w-full">
              <div className="space-y-4">
                {[
                  { icon: "🏥", label: "Stage", value: "Pre-seed → Series A" },
                  { icon: "🌍", label: "Geography", value: "US-focused" },
                  { icon: "⏱", label: "Response", value: "Within 2 weeks" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-5 p-4 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.35)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.6)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-sm"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(255,255,255,0.9)",
                      }}
                    >
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
      </div>
    </section>
  );
}
