"use client";

const PRINCIPLES = [
  {
    title: "Early Stage",
    body: "We lead pre-seed and seed rounds for healthcare companies with strong clinical validation.",
  },
  {
    title: "Healthcare Focused",
    body: "Exclusively investing in digital health, medtech, and healthcare infrastructure.",
  },
  {
    title: "Founder-First",
    body: "Deep operational support beyond the check — clinical networks, partnerships, and GTM strategy.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-white grid-pattern-light py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Eyebrow */}
        <p
          className="text-xs font-semibold tracking-[0.22em] uppercase mb-4"
          style={{ color: "#8B4513" }}
        >
          Our Focus
        </p>

        {/* Headline */}
        <h2
          className="text-4xl md:text-5xl font-extrabold mb-6 max-w-2xl"
          style={{ letterSpacing: "-0.025em", color: "#1C0F07" }}
        >
          Backing healthcare from seed to scale.
        </h2>

        {/* Body */}
        <p
          className="text-lg max-w-prose mb-16 leading-relaxed text-pretty"
          style={{ color: "#6b5c4e" }}
        >
          Healthworx Capital partners with founders building the future of healthcare — from
          AI-powered diagnostics to next-generation care delivery platforms. We bring capital,
          clinical networks, and decades of operational experience to every investment.
        </p>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border p-7 transition-all duration-300 hover:shadow-lg group"
              style={{ borderColor: "rgba(139,69,19,0.12)", background: "#FFFFFF" }}
            >
              <div
                className="w-8 h-0.5 mb-5 rounded-full transition-all duration-300 group-hover:w-12"
                style={{ background: "linear-gradient(90deg, #5C2D12, #A0522D)" }}
              />
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "#1C0F07", letterSpacing: "-0.01em" }}
              >
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b5c4e" }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
