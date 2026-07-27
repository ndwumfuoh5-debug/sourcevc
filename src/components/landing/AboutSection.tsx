"use client";

const FOCUS_AREAS = [
  {
    icon: "🏥",
    title: "Digital Health",
    desc: "Consumer health, telehealth, and remote monitoring platforms",
  },
  {
    icon: "🤖",
    title: "AI / ML in Healthcare",
    desc: "Clinical decision support, diagnostics, and workflow automation",
  },
  {
    icon: "🔗",
    title: "Payer-Provider Tech",
    desc: "Infrastructure modernizing how care is financed and delivered",
  },
];

const STATS = [
  { label: "Stage", value: "Pre-Seed → Series A" },
  { label: "Geography", value: "US-focused, open to global" },
  { label: "Check Size", value: "$25K–$250K" },
  { label: "Response Time", value: "Within 2 weeks" },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-4">
          About
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-16">
          Why submit to me?
        </h2>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          {/* Left: prose */}
          <div className="max-w-prose">
            <p className="text-gray-600 text-lg leading-relaxed text-pretty">
              I&apos;m an early-stage investor with a focus on healthcare and
              health-tech startups. I work closely with founders from pre-seed
              through Series A, helping them access capital, networks, and
              operational support.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed text-pretty mt-4">
              I believe the biggest breakthroughs in healthcare come from
              founders who&apos;ve lived the problem — people who understand the
              system&apos;s friction points from the inside and are building
              with conviction.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed text-pretty mt-4">
              Every submission I receive is personally reviewed. I don&apos;t
              use filters or automated rejections — if you&apos;re building in
              this space, I want to understand what you&apos;re working on.
            </p>
          </div>

          {/* Right: focus area cards */}
          <div id="focus" className="flex flex-col gap-4">
            {FOCUS_AREAS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 bg-[#FAFAF9] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What I look for strip */}
        <div className="border-t border-gray-100 pt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-8 text-center">
            What I look for
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <p className="text-xl font-bold text-gray-900 mb-1 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
