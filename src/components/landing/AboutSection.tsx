"use client";

const FOCUS_AREAS = [
  {
    number: "01",
    title: "Digital Health",
    desc: "Consumer health, telehealth, remote monitoring, and mental wellness platforms reshaping how care is accessed.",
  },
  {
    number: "02",
    title: "AI / ML in Healthcare",
    desc: "Clinical decision support, diagnostics, drug discovery, and workflow automation powered by modern AI.",
  },
  {
    number: "03",
    title: "Payer-Provider Tech",
    desc: "Infrastructure modernizing how care is financed, coordinated, and delivered across the health system.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-28 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 border-b border-gray-100 pb-16">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-5">About</p>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.03em] lowercase text-black">
              why submit<br />to me?
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-gray-500 text-base leading-relaxed text-pretty">
              I&apos;m an early-stage investor personally reviewing every submission.
              No filters. No automated rejections. If you&apos;re building in healthcare,
              I want to hear your story.
            </p>
          </div>
        </div>

        {/* Focus areas — numbered list style */}
        <div id="focus">
          <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-10">Focus areas</p>
          <div className="divide-y divide-gray-100">
            {FOCUS_AREAS.map((item) => (
              <div
                key={item.number}
                className="flex flex-col md:flex-row md:items-center gap-4 py-8 group hover:bg-gray-50 -mx-4 px-4 transition-colors"
              >
                <span className="text-[11px] tracking-widest text-black/25 font-medium w-8 shrink-0">
                  {item.number}
                </span>
                <div className="flex items-center gap-4 flex-1">
                  <h3 className="text-xl font-black tracking-tight text-black lowercase w-48 shrink-0">
                    {item.title}
                  </h3>
                  <div className="hidden md:block h-px bg-gray-200 flex-1 max-w-24" />
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {item.desc}
                  </p>
                </div>
                {/* Arrow on hover */}
                <span className="text-black/20 group-hover:text-black transition-colors text-lg">→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
          {[
            { label: "Stage", value: "Pre-seed → A" },
            { label: "Geography", value: "US-focused" },
            { label: "Check size", value: "$25K–$250K" },
            { label: "Response", value: "2 weeks" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 text-center">
              <p className="text-2xl font-black tracking-tight text-black mb-1">{stat.value}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
