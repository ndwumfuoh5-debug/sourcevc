"use client";

import { Stethoscope, Brain, Building2 } from "lucide-react";

const FOCUS_AREAS = [
  {
    title: "Digital Health",
    desc: "Consumer health, telehealth, remote monitoring, and mental wellness platforms reshaping how care is accessed and delivered.",
    Icon: Stethoscope,
  },
  {
    title: "AI / ML in Healthcare",
    desc: "Clinical decision support, diagnostics, drug discovery, and workflow automation powered by modern AI and machine learning.",
    Icon: Brain,
  },
  {
    title: "Payer-Provider Tech",
    desc: "Infrastructure modernizing how care is financed, coordinated, and delivered across the health system.",
    Icon: Building2,
  },
];

const STATS = [
  { label: "Stage", value: "Pre-seed → A" },
  { label: "Geography", value: "US-focused" },
  { label: "Check size", value: "$25K–$250K" },
  { label: "Response", value: "2 weeks" },
];

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="inline-flex items-center bg-[#f0f5fc] text-slate-500 text-xs px-4 py-1.5 rounded-full border border-slate-100 mb-5">
            About
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2 className="text-4xl font-bold text-[#1a1f2e] leading-tight">
              Why submit to me?
            </h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-sm text-pretty">
              I&apos;m an early-stage investor personally reviewing every
              submission. No filters. No automated rejections. If you&apos;re
              building in healthcare, I want to hear your story.
            </p>
          </div>
        </div>

        {/* Focus area cards */}
        <div id="focus" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {FOCUS_AREAS.map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="relative bg-[#f0f5fc] rounded-2xl p-7 border border-white/80 hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Ghost icon top-right */}
              <div className="absolute top-4 right-4 text-slate-200 pointer-events-none" aria-hidden="true">
                <Icon size={56} strokeWidth={1} />
              </div>

              <h3 className="font-semibold text-[#1a1f2e] text-base mb-2 relative z-10">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed relative z-10">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#f5f8fc] rounded-2xl p-6 text-center border border-slate-100"
            >
              <p className="text-2xl font-bold text-[#1a1f2e] mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
