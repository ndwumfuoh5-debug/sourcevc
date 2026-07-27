"use client";

import { PitchForm } from "./PitchForm";

export function SubmitSection() {
  return (
    <section id="submit" className="bg-[#F5F0EB] py-28 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 border-b border-gray-300 pb-12">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-5">Apply</p>
            <h2
              className="leading-[0.95] lowercase"
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "rgba(255,252,245,0.0)",
                WebkitTextStroke: "1.5px rgba(0,0,0,0.75)",
              }}
            >
              share your<br />vision.
            </h2>
          </div>
          <div className="max-w-xs">
            <p className="text-gray-500 text-sm leading-relaxed">
              Fill out the form below. Every submission is personally reviewed — 
              expect a response within two weeks.
            </p>
            {/* Decorative line */}
            <div className="flex items-center gap-3 mt-6">
              <div className="h-px bg-black w-12" />
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M0 5h14M10 1l4 4-4 4" stroke="black" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Form — clean white card */}
        <div className="bg-white p-10 md:p-16 rounded-3xl">
          <PitchForm />
        </div>
      </div>
    </section>
  );
}
