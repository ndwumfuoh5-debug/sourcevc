"use client";

import { PitchForm } from "./PitchForm";

export function SubmitSection() {
  return (
    <section id="submit" className="bg-[#edf2f8] py-28 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">

        {/* Section header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center bg-white/70 backdrop-blur text-slate-500 text-xs px-4 py-1.5 rounded-full border border-white/80 mb-5">
            Apply
          </div>
          <h2 className="text-4xl font-bold text-[#1a1f2e] leading-tight mb-4">
            Share your vision.
          </h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto text-pretty">
            Fill out the form below. Every submission is personally reviewed —
            expect a response within two weeks.
          </p>
        </div>

        {/* Frosted glass form card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/90 shadow-xl p-10 md:p-14">
          <PitchForm />
        </div>
      </div>
    </section>
  );
}
